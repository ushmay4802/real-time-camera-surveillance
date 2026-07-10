import prisma from "./prisma";

export async function connectDatabase() {
    console.log("✅ PostgreSQL Connecting");

    await prisma.$connect();
    console.log("✅ PostgreSQL Connected");
}

export async function checkDatabase() {

    try {

        await prisma.$queryRaw`SELECT 1`;

        return true;

    } catch {

        return false;

    }

}