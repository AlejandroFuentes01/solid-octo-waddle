// app/api/test-db/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await prisma.$connect();
        // Intenta una consulta simple
        const count = await prisma.user.count();
        await prisma.$disconnect();

        return NextResponse.json({
            status: "success",
            message: "Database connection successful",
            userCount: count
        });
    } catch (error) {
        console.error("Database connection test failed:", error);
        return NextResponse.json({
            status: "error",
            message: "Database connection failed",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}