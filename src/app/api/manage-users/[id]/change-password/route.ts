import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        // Obtener y validar el ID del usuario
        const { id } = context.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: "ID de usuario inválido" },
                { status: 400 }
            );
        }

        // Obtener y validar los datos del body
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json(
                { error: "Error al procesar los datos enviados" },
                { status: 400 }
            );
        }

        const { newPassword, adminPassword } = body || {};

        if (!newPassword || !adminPassword) {
            return NextResponse.json(
                { error: "Se requieren todos los campos" },
                { status: 400 }
            );
        }

        // Verificar que el usuario a modificar existe
        const targetUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Verificar la contraseña del administrador y sus permisos
        const adminUser = await prisma.user.findUnique({
            where: { username: session.user.username },
            select: { password: true, role: true }
        });

        if (!adminUser) {
            return NextResponse.json(
                { error: "Administrador no encontrado" },
                { status: 404 }
            );
        }

        if (adminUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: "No tienes permisos para realizar esta acción" },
                { status: 403 }
            );
        }

        const isAdminPasswordValid = await bcrypt.compare(adminPassword, adminUser.password);
        if (!isAdminPasswordValid) {
            return NextResponse.json(
                { error: "Contraseña de administrador incorrecta" },
                { status: 400 }
            );
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return NextResponse.json(
            { message: "Contraseña actualizada correctamente" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        
        return NextResponse.json(
            { error: "Error al cambiar la contraseña" },
            { status: 500 }
        );
    }
}