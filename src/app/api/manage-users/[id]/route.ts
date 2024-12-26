import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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