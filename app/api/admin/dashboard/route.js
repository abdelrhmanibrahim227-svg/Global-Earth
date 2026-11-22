
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET() {
    try {
        const admin = await getAdminUser();

        if (!admin) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const [
            products,
            orders,
            stores,
            revenue,
            allOrders,
        ] = await Promise.all([
            prisma.product.count(),

            prisma.order.count(),

            prisma.store.count({
                where: { status: "approved" },
            }),

            prisma.order.aggregate({
                where: { isPaid: true },
                _sum: { total: true },
            }),

            prisma.order.findMany({
                select: {
                    id: true,
                    total: true,
                    createdAt: true,
                    status: true,
                    isPaid: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            }),
        ]);

        return NextResponse.json({
            products,
            orders,
            stores,
            revenue: Number(revenue._sum.total || 0),
            allOrders,
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);

        return NextResponse.json(
            { message: "Failed to load dashboard data" },
            { status: 500 }
        );
    }
}
