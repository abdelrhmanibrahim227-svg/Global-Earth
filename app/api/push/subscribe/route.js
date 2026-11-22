
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const owner = await getOwnerUser();

        if (!owner) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const subscription = await request.json();

        if (
            !subscription?.endpoint ||
            !subscription?.keys?.p256dh ||
            !subscription?.keys?.auth
        ) {
            return NextResponse.json(
                { message: "Invalid push subscription" },
                { status: 400 }
            );
        }

        await prisma.pushSubscription.upsert({
            where: {
                endpoint: subscription.endpoint,
            },
            update: {
                userId: owner.id,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
            create: {
                userId: owner.id,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Device subscribed successfully",
        });
    } catch (error) {
        console.error("PUSH SUBSCRIBE ERROR:", error);

        return NextResponse.json(
            { message: "Unable to save device subscription" },
            { status: 500 }
        );
    }
}
