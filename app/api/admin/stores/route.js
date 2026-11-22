
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
    try {
        const admin = await getAdminUser();

        if (!admin) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const stores = await prisma.store.findMany({
            where: {
                status: "approved",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ stores });

    } catch (error) {
        console.error("Fetch admin stores error:", error);

        return NextResponse.json(
            { message: "Unable to fetch stores" },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const admin = await getAdminUser();

        if (!admin) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const storeId = String(body.storeId || "").trim();

        if (!storeId) {
            return NextResponse.json(
                { message: "Store ID is required" },
                { status: 400 }
            );
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: {
                id: true,
                status: true,
                isActive: true,
            },
        });

        if (!store) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 }
            );
        }

        if (store.status !== "approved") {
            return NextResponse.json(
                { message: "Only approved stores can be activated" },
                { status: 400 }
            );
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                isActive: !store.isActive,
            },
            select: {
                id: true,
                isActive: true,
                status: true,
            },
        });

        return NextResponse.json({
            message: updatedStore.isActive
                ? "Store activated successfully"
                : "Store deactivated successfully",
            store: updatedStore,
        });

    } catch (error) {
        console.error("Toggle store status error:", error);

        return NextResponse.json(
            { message: "Unable to update store" },
            { status: 500 }
        );
    }
}

