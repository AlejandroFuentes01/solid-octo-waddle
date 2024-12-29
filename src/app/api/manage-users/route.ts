import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Este archivo define una ruta API en Next.js para obtener una lista de usuarios con rol "NORMAL".
 *
 * La ruta maneja solicitudes GET y permite buscar usuarios por nombre de usuario, correo electrónico, nombre completo o área.
 *
 * Funcionalidad:
 * - Extrae los parámetros de búsqueda de la URL de la solicitud.
 * - Convierte la búsqueda a minúsculas para hacer la búsqueda case-insensitive.
 * - Busca usuarios en la base de datos que coincidan con los criterios de búsqueda.
 * - Devuelve una lista de usuarios que cumplen con los criterios de búsqueda en una respuesta JSON.
 *
 * Proceso de Búsqueda:
 * - El usuario envía una solicitud GET con un parámetro de búsqueda opcional.
 * - La API convierte el parámetro de búsqueda a minúsculas.
 * - La API busca usuarios en la base de datos que tengan el rol "NORMAL" y cuyo nombre de usuario, correo electrónico, nombre completo o área contengan el parámetro de búsqueda.
 * - La API devuelve una lista de usuarios que cumplen con los criterios de búsqueda.
 */

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