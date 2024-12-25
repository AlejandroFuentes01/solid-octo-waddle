import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        
        // Convertir búsqueda a minúsculas para hacer la búsqueda case-insensitive manualmente
        const searchLower = search.toLowerCase();
        
        console.log("Searching for:", searchLower);

        const users = await prisma.user.findMany({
            where: {
                role: "NORMAL",
                OR: search ? [
                    { username: { contains: searchLower } },
                    { email: { contains: searchLower } },
                    { fullName: { contains: searchLower } },
                    { area: { contains: searchLower } }
                ] : undefined
            },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                area: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`Found ${users.length} users`);
        
        return NextResponse.json(users);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error("Error fetching users:", errorMessage);
        
        return NextResponse.json(
            { error: "Error al obtener los usuarios", details: errorMessage },
            { status: 500 }
        );
    }
}