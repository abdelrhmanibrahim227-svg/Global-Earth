
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getAdminUser() {
    const userId = await getSession();

    if (!userId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    if (!user || !["OWNER", "ADMIN"].includes(user.role)) {
        return null;
    }

    return user;
}

export async function getOwnerUser() {
    const user = await getAdminUser();

    if (!user || user.role !== "OWNER") {
        return null;
    }

    return user;
}
