
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

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ coupons });
    } catch (error) {
        console.error("Fetch coupons error:", error);

        return NextResponse.json(
            { message: "Failed to load coupons" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const admin = await getAdminUser();

        if (!admin) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const body = await request.json();

        const code = String(body.code || "").trim().toUpperCase();
        const description = String(body.description || "").trim();
        const discount = Number(body.discount);
        const expiresAt = new Date(body.expiresAt);

        if (!code || !description || !body.expiresAt) {
            return NextResponse.json(
                { message: "Please complete all required fields" },
                { status: 400 }
            );
        }

        if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
            return NextResponse.json(
                { message: "Discount must be between 1 and 100" },
                { status: 400 }
            );
        }

        if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
            return NextResponse.json(
                { message: "Expiry date must be in the future" },
                { status: 400 }
            );
        }

        const existingCoupon = await prisma.coupon.findUnique({
            where: { code },
        });

        if (existingCoupon) {
            return NextResponse.json(
                { message: "This coupon code already exists" },
                { status: 409 }
            );
        }

        const coupon = await prisma.coupon.create({
            data: {
                code,
                description,
                discount,
                forNewUser: Boolean(body.forNewUser),
                forMember: Boolean(body.forMember),
                isPublic: Boolean(body.isPublic),
                expiresAt,
            },
        });

        return NextResponse.json(
            { message: "Coupon created successfully", coupon },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create coupon error:", error);

        return NextResponse.json(
            { message: "Failed to create coupon" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const admin = await getAdminUser();

        if (!admin) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const code = String(body.code || "").trim().toUpperCase();

        if (!code) {
            return NextResponse.json(
                { message: "Coupon code is required" },
                { status: 400 }
            );
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code },
        });

        if (!coupon) {
            return NextResponse.json(
                { message: "Coupon not found" },
                { status: 404 }
            );
        }

        await prisma.coupon.delete({
            where: { code },
        });

        return NextResponse.json({
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        console.error("Delete coupon error:", error);

        return NextResponse.json(
            { message: "Failed to delete coupon" },
            { status: 500 }
        );
    }
}
