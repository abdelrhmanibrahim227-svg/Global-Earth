
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// عرض التصنيفات النشطة
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(
            { categories },
            { status: 200 }
        );

    } catch (error) {
        console.error("GET CATEGORIES ERROR:", error);

        return NextResponse.json(
            { message: "Failed to load categories" },
            { status: 500 }
        );
    }
}
