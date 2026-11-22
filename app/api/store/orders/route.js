import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerUser } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const owner = await getOwnerUser();

        if (!owner) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const store = await prisma.store.findUnique({
            where: { userId: owner.id },
            select: { id: true },
        });

        if (!store) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 }
            );
        }

        const orders = await prisma.order.findMany({
            where: { storeId: store.id },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
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
        console.error("STORE ORDERS GET ERROR:", error);

        return NextResponse.json(
            { message: "Unable to load store orders" },
            { status: 500 }
        );
    }
}