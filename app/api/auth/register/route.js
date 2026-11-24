// app/api/auth/register/route.js  (replaces your current file)
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import {
    normalizePhone,
    sendWelcomeEmail,
    sendWelcomeWhatsApp,
} from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const body = await request.json();

        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        const phone = normalizePhone(body.phone);
        const whatsappOptIn = body.whatsappOptIn === true && Boolean(phone);

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (name.length > 100 || email.length > 254) {
            return NextResponse.json(
                { message: "Invalid input length" },
                { status: 400 }
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { message: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        if (password.length < 8 || password.length > 72) {
            return NextResponse.json(
                { message: "Password must be between 8 and 72 characters" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "This email is already registered" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                id: randomUUID(),
                name,
                email,
                passwordHash,
                image: "",
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });

        await createSession(user.id);

        // Welcome messages: failures are logged and never block registration
        const [emailResult, whatsappResult] = await Promise.allSettled([
            sendWelcomeEmail({ name: user.name, email: user.email }),
            whatsappOptIn
                ? sendWelcomeWhatsApp({ name: user.name, phone })
                : Promise.resolve(false),
        ]);

        return NextResponse.json(
            {
                message: "Account created successfully",
                user,
                welcome: {
                    email: emailResult.status === "fulfilled" && emailResult.value === true,
                    whatsapp:
                        whatsappResult.status === "fulfilled" &&
                        whatsappResult.value === true,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        if (error.code === "P2002") {
            return NextResponse.json(
                { message: "This email is already registered" },
                { status: 409 }
            );
        }

        console.error("Register error:", error);

        return NextResponse.json(
            { message: "Unable to create account" },
            { status: 500 }
        );
    }
}
