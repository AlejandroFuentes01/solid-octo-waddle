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
        
        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: "No tienes permisos para realizar esta acción" },
                { status: 403 }
            );
        }

        const { id } = await context.params;
        const userId = parseInt(id);

        const { newPassword, adminPassword } = await request.json();
        
        if (!newPassword || !adminPassword) {
            return NextResponse.json(
                { error: "Se requieren todos los campos" },
                { status: 400 }
            );
        }

        // Verificar que existe el usuario a modificar
        const targetUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Verificar la contraseña del administrador
        const adminUser = await prisma.user.findUnique({
            where: { username: session.user.username },
            select: { password: true }
        });

        if (!adminUser) {
            return NextResponse.json(
                { error: "Administrador no encontrado" },
                { status: 404 }
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