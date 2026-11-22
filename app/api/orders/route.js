
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import webpush from "web-push";

export const runtime = "nodejs";

async function sendOrderNotifications(orders, storeGroups, products) {
    if (
        !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
        !process.env.VAPID_PRIVATE_KEY ||
        !process.env.VAPID_SUBJECT
    ) {
        console.warn("Push notification keys are not configured.");
        return;
    }

    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );

    for (const order of orders) {
        try {
            const store = await prisma.store.findUnique({
                where: { id: order.storeId },
                select: { userId: true, name: true },
            });

            if (!store) continue;

            const subscriptions = await prisma.pushSubscription.findMany({
                where: { userId: store.userId },
            });

            const productCount = (storeGroups.get(order.storeId) || [])
                .reduce((sum, item) => sum + item.quantity, 0);

            const payload = JSON.stringify({
                title: "طلب جديد - GLOBAL EARTH",
                body: `طلب جديد يحتوي على ${productCount} قطعة بقيمة ${order.total.toLocaleString("en-EG")} ج.م`,
                url: "/store/orders",
            });

            await Promise.all(
                subscriptions.map(async (subscription) => {
                    try {
                        await webpush.sendNotification(
                            {
                                endpoint: subscription.endpoint,
                                keys: {
                                    p256dh: subscription.p256dh,
                                    auth: subscription.auth,
                                },
                            },
                            payload
                        );
                    } catch (error) {
                        console.error("Push delivery error:", error.statusCode);

                        if (error.statusCode === 404 || error.statusCode === 410) {
                            await prisma.pushSubscription.deleteMany({
                                where: { endpoint: subscription.endpoint },
                            });
                        }
                    }
                })
            );
        } catch (error) {
            console.error("Order notification error:", error);
        }
    }
}

export async function GET() {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json(
                { message: "Please login first" },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                address: true,
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Orders loading error:", error);

        return NextResponse.json(
            { message: "Unable to load orders" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json(
                { message: "Please login first" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { items, addressId, paymentMethod } = body;

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { message: "Your cart is empty" },
                { status: 400 }
            );
        }

        if (!addressId) {
            return NextResponse.json(
                { message: "Please select a delivery address" },
                { status: 400 }
            );
        }

        if (paymentMethod !== "COD") {
            return NextResponse.json(
                { message: "This payment method is not available yet" },
                { status: 400 }
            );
        }

        const address = await prisma.address.findFirst({
            where: { id: addressId, userId },
        });

        if (!address) {
            return NextResponse.json(
                { message: "Invalid delivery address" },
                { status: 400 }
            );
        }

        const quantities = new Map();

        for (const item of items) {
            const productId = String(item.productId || "");
            const quantity = Number(item.quantity);

            if (
                !productId ||
                !Number.isSafeInteger(quantity) ||
                quantity < 1 ||
                quantity > 100
            ) {
                return NextResponse.json(
                    { message: "Invalid product or quantity" },
                    { status: 400 }
                );
            }

            quantities.set(
                productId,
                (quantities.get(productId) || 0) + quantity
            );
        }

        const productIds = [...quantities.keys()];

        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: {
                store: {
                    select: {
                        id: true,
                        status: true,
                        isActive: true,
                    },
                },
            },
        });

        if (products.length !== productIds.length) {
            return NextResponse.json(
                { message: "One or more products are unavailable" },
                { status: 400 }
            );
        }

        const storeGroups = new Map();

        for (const product of products) {
            if (
                !product.inStock ||
                !product.store ||
                product.store.status !== "approved" ||
                !product.store.isActive
            ) {
                return NextResponse.json(
                    {
                        message: `Product "${product.name}" is currently unavailable`,
                    },
                    { status: 400 }
                );
            }

            const quantity = quantities.get(product.id);

            if (!Number.isFinite(product.price) || product.price < 0) {
                return NextResponse.json(
                    { message: "Invalid product price" },
                    { status: 400 }
                );
            }

            const storeId = product.storeId;

            if (!storeGroups.has(storeId)) {
                storeGroups.set(storeId, []);
            }

            storeGroups.get(storeId).push({
                productId: product.id,
                quantity,
                price: product.price,
            });
        }

        const orders = await prisma.$transaction(async (tx) => {
            const createdOrders = [];

            for (const [storeId, storeItems] of storeGroups) {
                const total = storeItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );

                const order = await tx.order.create({
                    data: {
                        userId,
                        storeId,
                        addressId,
                        total,
                        paymentMethod: "COD",
                        isPaid: false,
                        orderItems: {
                            create: storeItems.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price,
                            })),
                        },
                    },
                    include: {
                        orderItems: true,
                        address: true,
                    },
                });

                createdOrders.push(order);
            }

            return createdOrders;
        });

        // Send notifications after the orders have been saved.
        await sendOrderNotifications(orders, storeGroups, products);

        return NextResponse.json(
            {
                message: "Order placed successfully",
                orders,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return NextResponse.json(
            { message: "Unable to place order" },
            { status: 500 }
        );
    }
}
