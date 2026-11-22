
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerUser } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: عرض متجر عام أو متجر المالك الحالي
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const username = searchParams.get("username");
        const userId = searchParams.get("userId");

        // البحث العام عن متجر باستخدام username
        if (username) {
            const store = await prisma.store.findUnique({
                where: { username },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    description: true,
                    logo: true,
                    status: true,
                    isActive: true,
                },
            });

            if (!store || !store.isActive || store.status !== "approved") {
                return NextResponse.json(
                    { message: "Store not found or unavailable" },
                    { status: 404 }
                );
            }

            const products = await prisma.product.findMany({
                where: {
                    storeId: store.id,
                    inStock: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return NextResponse.json(
                { store, products },
                { status: 200 }
            );
        }

        // البحث عن متجر المالك المسجل فقط
        if (userId) {
            const owner = await getOwnerUser();

            if (!owner) {
                return NextResponse.json(
                    { message: "Unauthorized" },
                    { status: 403 }
                );
            }

            // منع الوصول إلى متجر مستخدم آخر
            if (userId !== owner.id) {
                return NextResponse.json(
                    { message: "Access denied" },
                    { status: 403 }
                );
            }

            const store = await prisma.store.findUnique({
                where: {
                    userId: owner.id,
                },
            });

            return NextResponse.json(
                { store },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "Username or User ID is required" },
            { status: 400 }
        );

    } catch (error) {
        console.error("GET STORE ERROR:", error);

        return NextResponse.json(
            { message: "Failed to fetch store" },
            { status: 500 }
        );
    }
}

// POST: إنشاء متجر - OWNER فقط
export async function POST(request) {
    try {
        const owner = await getOwnerUser();

        if (!owner) {
            return NextResponse.json(
                { message: "Unauthorized. Owner access required." },
                { status: 403 }
            );
        }

        const body = await request.json();

        const {
            name,
            username,
            description,
            email,
            contact,
            address,
            logo,
        } = body;

        if (
            typeof name !== "string" || !name.trim() ||
            typeof username !== "string" || !username.trim() ||
            typeof description !== "string" || !description.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof contact !== "string" || !contact.trim() ||
            typeof address !== "string" || !address.trim()
        ) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // التأكد من عدم وجود متجر للمالك أو استخدام الاسم
        const existingStore = await prisma.store.findFirst({
            where: {
                OR: [
                    { username: username.trim() },
                    { userId: owner.id },
                ],
            },
        });

        if (existingStore) {
            return NextResponse.json(
                {
                    message: "Store already exists for this user or username is taken",
                },
                { status: 409 }
            );
        }

        // إنشاء المتجر وربطه بالمالك من الجلسة
        const store = await prisma.store.create({
            data: {
                userId: owner.id,
                name: name.trim(),
                username: username.trim(),
                description: description.trim(),
                email: email.trim(),
                contact: contact.trim(),
                address: address.trim(),
                logo: typeof logo === "string" ? logo.trim() : "",
                status: "pending",
                isActive: false,
            },
        });

        return NextResponse.json(
            {
                message: "Store submitted successfully",
                store,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("CREATE STORE ERROR:", error);

        return NextResponse.json(
            { message: "Failed to create store" },
            { status: 500 }
        );
    }
}