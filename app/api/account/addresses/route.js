
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json(
                { message: "Please login first" },
                { status: 401 }
            );
        }

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ addresses });
    } catch (error) {
        console.error("GET ADDRESSES ERROR:", error);

        return NextResponse.json(
            { message: "Unable to load addresses" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json(
                { message: "Please login first" },
                { status: 401 }
            );
        }

        const body = await request.json();

        const requiredFields = [
            "name",
            "email",
            "street",
            "city",
            "state",
            "country",
            "phone",
        ];

        for (const field of requiredFields) {
            if (
                typeof body[field] !== "string" ||
                !body[field].trim()
            ) {
                return NextResponse.json(
                    { message: `Invalid field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const address = await prisma.address.create({
            data: {
                userId,
                name: body.name.trim(),
                email: body.email.trim(),
                street: body.street.trim(),
                city: body.city.trim(),
                state: body.state.trim(),
                zip: typeof body.zip === "string" ? body.zip.trim() : "",
                country: body.country.trim(),
                phone: body.phone.trim(),
            },
        });

        return NextResponse.json(
            { message: "Address saved successfully", address },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE ADDRESS ERROR:", error);

        return NextResponse.json(
            { message: "Unable to save address" },
            { status: 500 }
        );
    }
}
