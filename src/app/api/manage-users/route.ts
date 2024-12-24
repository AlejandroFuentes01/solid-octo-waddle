import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";

        // Consulta para obtener solo usuarios con rol NORMAL
        const users = await prisma.user.findMany({
            where: {
                role: "NORMAL", // Filtrar por rol
                OR: search
                    ? [
                          { username: { contains: search, mode: "insensitive" } },
                          { email: { contains: search, mode: "insensitive" } },
                          { fullName: { contains: search, mode: "insensitive" } },
                          { area: { contains: search, mode: "insensitive" } },
                      ]
                    : undefined,
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
        });

        if (!users.length) {
            return NextResponse.json(
                { error: "No se encontraron usuarios con rol NORMAL" },
                { status: 404 }
            );
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return NextResponse.json(
            { error: "Error al obtener los usuarios" },
            { status: 500 }
        );
    }
}
