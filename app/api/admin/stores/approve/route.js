
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
                status: "pending",
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
        console.error("Fetch pending stores error:", error);

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
        const status = String(body.status || "").trim().toLowerCase();

        if (!storeId || !["approved", "rejected"].includes(status)) {
            return NextResponse.json(
                { message: "Invalid store ID or status" },
                { status: 400 }
            );
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: {
                id: true,
                status: true,
            },
        });

        if (!store) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 }
            );
        }

        if (store.status !== "pending") {
            return NextResponse.json(
                { message: "This store has already been reviewed" },
                { status: 409 }
            );
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                status,
                isActive: status === "approved",
            },
            select: {
                id: true,
                name: true,
                username: true,
                status: true,
                isActive: true,
            },
        });

        return NextResponse.json({
            message: status === "approved"
                ? "Store approved successfully"
                : "Store rejected successfully",
            store: updatedStore,
        });

    } catch (error) {
        console.error("Update store approval error:", error);

        return NextResponse.json(
            { message: "Unable to update store status" },
            { status: 500 }
        );
    }
}
