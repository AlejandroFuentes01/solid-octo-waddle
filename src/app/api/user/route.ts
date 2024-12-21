// 1. api/user/route.ts
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

const userSchema = yup.object().shape({
    fullName: yup.string().required('El nombre completo es obligatorio'),
    username: yup.string().required('El nombre de usuario es obligatorio'),
    email: yup.string().email('El correo electrónico no es válido').required('El correo electrónico es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria'),
    area: yup.string().required('El área es obligatoria'),
    role: yup.string().oneOf(['ADMIN', 'NORMAL'], 'El rol no es válido').required('El rol es obligatorio'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Datos recibidos:', body);

        // Validar los datos de entrada
        await userSchema.validate(body, { abortEarly: false });

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

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
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

        console.log('Usuario creado:', user);

        // Omitir la contraseña en la respuesta
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            message: 'Usuario creado exitosamente',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error detallado:', error);
        if (error instanceof yup.ValidationError) {
            return NextResponse.json(
                { error: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Error al crear el usuario' },
            { status: 500 }
        );
    }
}