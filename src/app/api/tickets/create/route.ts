import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Este archivo define una ruta API en Next.js para crear nuevos tickets.
 *
 * La ruta maneja solicitudes POST, verifica la autenticación del usuario,
 * valida los datos de entrada y guarda el nuevo ticket en la base de datos.
 *
 * Funcionalidad:
 * - Verifica si el usuario está autenticado utilizando `next-auth`.
 * - Extrae y valida los datos del cuerpo de la solicitud.
 * - Obtiene la información del usuario autenticado desde la base de datos.
 * - Crea un nuevo ticket en la base de datos con los datos proporcionados.
 * - Maneja adecuadamente los errores y devuelve respuestas HTTP apropiadas.
 */

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {// Si no hay usuario autenticado,  retornar error
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Extraer los datos del body
        const { servicioSolicitado, descripcion } = await request.json();

        if (!servicioSolicitado || !descripcion) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        // Obtener información del usuario autenticado
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Obtener el último folio
        const lastTicket = await prisma.ticket.findFirst({
            orderBy: { id: 'desc' }
        });

        const newFolio = `TK${(lastTicket ? lastTicket.id + 1 : 1).toString().padStart(4, '0')}`;

        // Crear ticket con datos automáticos y entrada del usuario
        const newTicket = await prisma.ticket.create({
            data: {
                service: servicioSolicitado,
                description: descripcion,
                area: user.area,
                requester: user.email,
                folio: newFolio,
                userId: user.id,
                status: 'PENDIENTE'
            }
        });

        return NextResponse.json(
            {
                message: 'Ticket creado exitosamente',
                ticket: newTicket
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error al crear el ticket:', error);
        return NextResponse.json(
            { error: 'Error al crear el ticket' },
            { status: 500 }
        );
    }
}