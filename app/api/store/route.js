
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerUser } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        // Public store lookup by username
        if (username) {
            const store = await prisma.store.findFirst({
                where: {
                    username,
                    status: "approved",
                    isActive: true,
                },
            });

            if (!store) {
                return NextResponse.json(
                    { message: "Store not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ store });
        }

        // Owner's own store
        const owner = await getOwnerUser();

        if (!owner) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const store = await prisma.store.findUnique({
            where: { userId: owner.id },
        });

        if (!store) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ store });
    } catch (error) {
        console.error("GET STORE ERROR:", error);

        return NextResponse.json(
            { message: "Unable to load store" },
            { status: 500 }
        );
    }
}
