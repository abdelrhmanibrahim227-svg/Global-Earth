import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

// التحقق من ملكية المنتج
async function getOwnedProduct(productId, ownerId) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            storeId: true,
        },
    });

    if (!product) {
        return { error: "المنتج غير موجود.", status: 404 };
    }

    const store = await prisma.store.findFirst({
        where: {
            id: product.storeId,
            userId: ownerId,
        },
        select: { id: true },
    });

    if (!store) {
        return {
            error: "غير مسموح لك بإدارة هذا المنتج.",
            status: 403,
        };
    }

    return { product };
}

// PATCH: تعديل بيانات المنتج أو حالته - OWNER فقط
export async function PATCH(request, { params }) {
    try {
        const owner = await getOwnerUser();

        if (!owner) {
            return NextResponse.json(
                { error: "Unauthorized. Owner access required." },
                { status: 403 }
            );
        }

        const { productId } = await params;

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required." },
                { status: 400 }
            );
        }

        const body = await request.json();

        const result = await getOwnedProduct(productId, owner.id);

        if (result.error) {
            return NextResponse.json(
                { error: result.error },
                { status: result.status }
            );
        }

        const updateData = {};

        // الاسم
        if (body.name !== undefined) {
            if (typeof body.name !== "string" || !body.name.trim()) {
                return NextResponse.json(
                    { error: "اسم المنتج غير صحيح." },
                    { status: 400 }
                );
            }

            updateData.name = body.name.trim();
        }

        // الوصف
        if (body.description !== undefined) {
            if (typeof body.description !== "string") {
                return NextResponse.json(
                    { error: "وصف المنتج غير صحيح." },
                    { status: 400 }
                );
            }

            updateData.description = body.description.trim();
        }

        // السعر الأصلي وسعر البيع
        for (const field of ["mrp", "price"]) {
            if (body[field] !== undefined) {
                const value = Number(body[field]);

                if (!Number.isFinite(value) || value < 0) {
                    return NextResponse.json(
                        { error: `قيمة ${field} غير صحيحة.` },
                        { status: 400 }
                    );
                }

                updateData[field] = value;
            }
        }

        // التصنيف
        if (body.categoryId !== undefined) {
            if (body.categoryId === null || body.categoryId === "") {
                updateData.categoryId = null;
            } else {
                if (typeof body.categoryId !== "string") {
                    return NextResponse.json(
                        { error: "التصنيف غير صحيح." },
                        { status: 400 }
                    );
                }

                const category = await prisma.category.findFirst({
                    where: {
                        id: body.categoryId,
                        isActive: true,
                    },
                    select: {
                        id: true,
                        name: true,
                    },
                });

                if (!category) {
                    return NextResponse.json(
                        { error: "التصنيف المحدد غير موجود أو غير نشط." },
                        { status: 400 }
                    );
                }

                updateData.categoryId = category.id;
                updateData.category = category.name;
            }
        }

        // الصور
        if (body.images !== undefined) {
            if (
                !Array.isArray(body.images) ||
                !body.images.every(
                    image => typeof image === "string"
                )
            ) {
                return NextResponse.json(
                    { error: "قائمة الصور غير صحيحة." },
                    { status: 400 }
                );
            }

            updateData.images = body.images;
        }

        // حالة التوفر
        if (body.inStock !== undefined) {
            if (typeof body.inStock !== "boolean") {
                return NextResponse.json(
                    { error: "حالة المنتج غير صحيحة." },
                    { status: 400 }
                );
            }

            updateData.inStock = body.inStock;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "لا توجد بيانات لتحديثها." },
                { status: 400 }
            );
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: updateData,
        });

        return NextResponse.json(
            {
                message: "تم تحديث المنتج بنجاح.",
                product,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);

        return NextResponse.json(
            { error: "حدث خطأ أثناء تحديث المنتج." },
            { status: 500 }
        );
    }
}

// DELETE: حذف المنتج - OWNER فقط
export async function DELETE(request, { params }) {
    try {
        const owner = await getOwnerUser();

        if (!owner) {
            return NextResponse.json(
                { error: "Unauthorized. Owner access required." },
                { status: 403 }
            );
        }

        const { productId } = await params;

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required." },
                { status: 400 }
            );
        }

        const result = await getOwnedProduct(productId, owner.id);

        if (result.error) {
            return NextResponse.json(
                { error: result.error },
                { status: result.status }
            );
        }

        await prisma.product.delete({
            where: { id: productId },
        });

        return NextResponse.json(
            { message: "تم حذف المنتج بنجاح." },
            { status: 200 }
        );

    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);

        // المنتج مرتبط بطلبات سابقة
        if (
            error.code === "P2003" ||
            error.code === "P2014"
        ) {
            return NextResponse.json(
                {
                    error: "لا يمكن حذف هذا المنتج لأنه مرتبط بطلبات سابقة. يمكنك إيقافه بدلًا من حذفه."
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "حدث خطأ أثناء حذف المنتج." },
            { status: 500 }
        );
    }
}