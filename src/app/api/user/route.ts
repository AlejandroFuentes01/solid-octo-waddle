// src/app/api/user/route.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullName, username, email, password, area, role } = body;

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return NextResponse.json(
                    { error: 'El nombre de usuario ya está en uso' },
                    { status: 400 }
                );
            }
            if (existingUser.email === email) {
                return NextResponse.json(
                    { error: 'El correo electrónico ya está registrado' },
                    { status: 400 }
                );
            }
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const user = await prisma.user.create({
            data: {
                fullName,
                username,
                email,
                password: hashedPassword,
                area,
                role: role.toUpperCase() as Role,
            },
        });

        // Omitir la contraseña en la respuesta
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: 'Usuario creado exitosamente',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        return NextResponse.json(
            { error: 'Error al crear el usuario' },
            { status: 500 }
        );
    }
}