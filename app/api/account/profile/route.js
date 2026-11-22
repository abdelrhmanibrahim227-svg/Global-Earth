
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// عرض بيانات الحساب
export async function GET() {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json(
                { message: "Please login first" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Account not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });

    } catch (error) {
        console.error("Profile loading error:", error);

        return NextResponse.json(
            { message: "Unable to load profile" },
            { status: 500 }
        );
    }
}

// تعديل اسم العميل فقط
export async function PATCH(request) {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json(
                { message: "Please login first" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const name = typeof body.name === "string"
            ? body.name.trim()
            : "";

        if (name.length < 2 || name.length > 60) {
            return NextResponse.json(
                { message: "Name must be between 2 and 60 characters" },
                { status: 400 }
            );
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { name },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user,
        });

    } catch (error) {
        console.error("Profile update error:", error);

        return NextResponse.json(
            { message: "Unable to update profile" },
            { status: 500 }
        );
    }
}
