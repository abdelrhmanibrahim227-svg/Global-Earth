const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: {
            id: "dev-user-1",
        },
        update: {},
        create: {
            id: "dev-user-1",
            name: "Store Owner",
            email: "owner@example.com",
            image: "",
            cart: {},
        },
    });

    const store = await prisma.store.upsert({
        where: {
            userId: user.id,
        },
        update: {},
        create: {
            userId: user.id,
            name: "My Store",
            username: "mystore",
            description: "My Global Store",
            address: "123 Main Street",
            status: "approved",
            isActive: true,
            logo: "",
            email: user.email,
            contact: "01557040056",
        },
    });

    console.log("User created:", user.id);
    console.log("Store created:", store.id);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });