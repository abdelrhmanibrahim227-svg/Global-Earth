
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { getOwnerUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

const extensionByType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
    try {
        // التحقق من صلاحية المالك
        const owner = await getOwnerUser();

        if (!owner) {
            return NextResponse.json(
                { error: "Unauthorized. Owner access required." },
                { status: 403 }
            );
        }

        // التحقق من إعدادات Supabase
        const secretKey = process.env.SUPABASE_SECRET_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!secretKey || !supabaseUrl) {
            console.error("Supabase server configuration is missing.");

            return NextResponse.json(
                { error: "Image storage configuration is missing." },
                { status: 500 }
            );
        }

        // استقبال الصورة
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || typeof file.arrayBuffer !== "function") {
            return NextResponse.json(
                { error: "Please select an image." },
                { status: 400 }
            );
        }

        // التحقق من نوع الصورة
        if (!allowedTypes.has(file.type)) {
            return NextResponse.json(
                { error: "Use a JPG, PNG, WebP, or GIF image." },
                { status: 400 }
            );
        }

        // التحقق من الحجم
        if (file.size <= 0 || file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "Image size must be between 1 byte and 5 MB." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        if (buffer.length !== file.size) {
            return NextResponse.json(
                { error: "Invalid image file." },
                { status: 400 }
            );
        }

        // إنشاء اتصال Supabase من جهة السيرفر
        const supabase = createClient(supabaseUrl, secretKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        // اسم عشوائي للصورة
        const extension = extensionByType[file.type];
        const path = `products/${randomUUID()}.${extension}`;

        // رفع الصورة
        const { error } = await supabase.storage
            .from("products")
            .upload(path, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("SUPABASE IMAGE UPLOAD ERROR:", error.message);

            return NextResponse.json(
                {
                    error: "Image upload failed.",
                    details:
                        process.env.NODE_ENV === "development"
                            ? error.message
                            : undefined,
                },
                { status: 500 }
            );
        }

        // استخراج رابط الصورة
        const { data } = supabase.storage
            .from("products")
            .getPublicUrl(path);

        return NextResponse.json(
            {
                message: "Image uploaded successfully.",
                url: data.publicUrl,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("IMAGE UPLOAD ERROR:", error);

        return NextResponse.json(
            { error: "Unable to upload image." },
            { status: 500 }
        );
    }
}