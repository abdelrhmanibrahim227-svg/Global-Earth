
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
    try {
        // Get authenticated user from session
        const userId = await getSession()

        if (!userId) {
            return NextResponse.json(
                { error: "Please login first" },
                { status: 401 }
            )
        }

        // Find the logged-in user's store
        const store = await prisma.store.findUnique({
            where: { userId },
            select: {
                id: true,
                name: true,
                username: true,
                status: true,
                isActive: true,
            },
        })

        if (!store) {
            return NextResponse.json(
                { error: "Store not found for this account" },
                { status: 404 }
            )
        }

        const storeId = store.id

        const [
            totalProducts,
            totalOrders,
            earningsResult,
            ratings,
            totalRatings
        ] = await Promise.all([
            prisma.product.count({
                where: { storeId },
            }),

            prisma.order.count({
                where: { storeId },
            }),

            prisma.order.aggregate({
                where: {
                    storeId,
                    status: "DELIVERED",
                },
                _sum: {
                    total: true,
                },
            }),

            prisma.rating.findMany({
                where: {
                    product: { storeId },
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 20,
                select: {
                    id: true,
                    rating: true,
                    review: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            name: true,
                            category: true,
                        },
                    },
                },
            }),

            prisma.rating.count({
                where: {
                    product: { storeId },
                },
            }),
        ])

        return NextResponse.json({
            store,
            dashboardData: {
                totalProducts,
                totalEarnings: earningsResult._sum.total || 0,
                totalOrders,
                totalRatings,
                ratings,
            },
        })

    } catch (error) {
        console.error("STORE DASHBOARD ERROR:", error)

        return NextResponse.json(
            { error: "Failed to load store dashboard" },
            { status: 500 }
        )
    }
}
