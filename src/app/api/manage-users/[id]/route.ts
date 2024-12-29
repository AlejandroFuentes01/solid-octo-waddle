import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Este archivo define una ruta API en Next.js para eliminar un usuario específico.
 *
 * La ruta maneja solicitudes DELETE y permite eliminar un usuario de la base de datos utilizando su ID.
 *
 * Funcionalidad:
 * - Extrae el ID del usuario de los parámetros de la URL de la solicitud.
 * - Valida que el ID del usuario sea un número válido.
 * - Elimina el usuario de la base de datos utilizando Prisma.
 * - Devuelve una respuesta JSON indicando el éxito o el error de la operación.
 *
 * Proceso de Eliminación:
 * - El usuario envía una solicitud DELETE con el ID del usuario a eliminar en los parámetros de la URL.
 * - La API extrae y valida el ID del usuario.
 * - Si el ID es válido, la API elimina el usuario de la base de datos.
 * - La API devuelve una respuesta JSON indicando si la eliminación fue exitosa o si ocurrió un error.
 */

export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        // Asegurarse de que los parámetros estén disponibles
        const { id } = await context.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "ID de usuario no válido" },
                { status: 400 }
            );
        }

        // Eliminar el usuario
        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json(
            { message: "Usuario eliminado correctamente" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return NextResponse.json(
            { error: "Error al eliminar el usuario" },
            { status: 500 }
        );
    }
}

// También actualizar el método GET
export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    return NextResponse.json({ message: "GET method not implemented" }, { status: 501 });
}