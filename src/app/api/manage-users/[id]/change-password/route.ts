import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Este archivo define una ruta API en Next.js para cambiar la contraseña de un usuario específico.
 *
 * La ruta maneja solicitudes PUT y permite a los administradores cambiar la contraseña de un usuario.
 *
 * Funcionalidad:
 * - Verifica si el usuario está autenticado y tiene permisos de administrador utilizando `next-auth`.
 * - Extrae el ID del usuario de los parámetros de la URL de la solicitud.
 * - Valida los datos de entrada, incluyendo la nueva contraseña y la contraseña del administrador.
 * - Verifica la contraseña del administrador para asegurar que tiene permisos para realizar la acción.
 * - Hashea la nueva contraseña y actualiza la contraseña del usuario en la base de datos utilizando Prisma.
 * - Devuelve una respuesta JSON indicando el éxito o el error de la operación.
 *
 * Proceso de Cambio de Contraseña:
 * - El administrador envía una solicitud PUT con el ID del usuario a modificar en los parámetros de la URL y las contraseñas en el cuerpo de la solicitud.
 * - La API verifica que el administrador esté autenticado y tenga permisos.
 * - La API extrae y valida el ID del usuario y las contraseñas.
 * - Si las contraseñas son válidas, la API hashea la nueva contraseña y actualiza la contraseña del usuario en la base de datos.
 * - La API devuelve una respuesta JSON indicando si el cambio de contraseña fue exitoso o si ocurrió un error.
 */

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