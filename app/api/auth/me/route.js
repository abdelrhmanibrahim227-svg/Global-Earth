
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    let userId;

    // Check session separately
    try {
        userId = await getSession();
    } catch (error) {
        console.error("GET SESSION ERROR:", error);

        return NextResponse.json(
            { message: "Session verification failed" },
            { status: 500 }
        );
    }

    if (!userId) {
        return NextResponse.json(
            { message: "Not logged in", user: null },
            { status: 401 }
        );
    }

    // Check database separately
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found", user: null },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("AUTH USER DATABASE ERROR:", error);

        return NextResponse.json(
            { message: "Database error while checking user" },
            { status: 500 }
        );
    }
}
