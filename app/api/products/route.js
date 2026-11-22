
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerUser } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: عرض المنتجات مع بيانات المتجر العامة فقط
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        logo: true,
                    },
                },
            },
        });

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error);

        return NextResponse.json(
            { error: "Failed to fetch products." },
            { status: 500 }
        );
    }
}

// POST: إضافة منتج جديد - OWNER فقط
export async function POST(request) {
    try {
        const owner = await getOwnerUser();

        if (!owner) {
            return NextResponse.json(
                { error: "Access denied. Store owner only." },
                { status: 403 }
            );
        }

        const body = await request.json();

        const {
            name,
            description,
            mrp,
            price,
            category,
            categoryId,
            images,
            storeId,
        } = body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            typeof categoryId !== "string" ||
            !categoryId.trim() ||
            typeof storeId !== "string" ||
            !storeId.trim()
        ) {
            return NextResponse.json(
                { error: "Please complete all required fields." },
                { status: 400 }
            );
        }

        const actualPrice = Number(mrp);
        const offerPrice = Number(price);

        if (
            mrp === "" ||
            price === "" ||
            !Number.isFinite(actualPrice) ||
            !Number.isFinite(offerPrice) ||
            actualPrice <= 0 ||
            offerPrice <= 0 ||
            offerPrice > actualPrice
        ) {
            return NextResponse.json(
                {
                    error: "Prices must be greater than zero, and the offer price cannot exceed the actual price.",
                },
                { status: 400 }
            );
        }

        const productImages = images === undefined ? [] : images;

        if (
            !Array.isArray(productImages) ||
            productImages.length > 4 ||
            !productImages.every(
                (url) =>
                    typeof url === "string" &&
                    url.trim().length > 0
            )
        ) {
            return NextResponse.json(
                { error: "Invalid product images." },
                { status: 400 }
            );
        }

        // التأكد أن المتجر تابع للمالك الحالي
        const store = await prisma.store.findFirst({
            where: {
                id: storeId,
                userId: owner.id,
            },
            select: {
                id: true,
            },
        });

        if (!store) {
            return NextResponse.json(
                { error: "Store not found or access denied." },
                { status: 403 }
            );
        }

        // التأكد أن التصنيف موجود ونشط
        const selectedCategory = await prisma.category.findFirst({
            where: {
                id: categoryId,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
            },
        });

        if (!selectedCategory) {
            return NextResponse.json(
                { error: "Selected category does not exist or is inactive." },
                { status: 400 }
            );
        }

        // إنشاء المنتج وربطه بالتصنيف
        const product = await prisma.product.create({
            data: {
                name: name.trim(),
                description: description.trim(),
                mrp: actualPrice,
                price: offerPrice,
                category: selectedCategory.name,
                categoryId: selectedCategory.id,
                images: productImages.map((url) => url.trim()),
                storeId: store.id,
            },
        });

        return NextResponse.json(
            {
                message: "Product added successfully.",
                product,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);

        return NextResponse.json(
            { error: "Failed to create product. Please try again." },
            { status: 500 }
        );
    }
}
