import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { TicketStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Este archivo define una ruta API en Next.js para que los administradores gestionen tickets.
 *
 * La ruta maneja solicitudes GET, PATCH y DELETE, verifica la autenticación del usuario,
 * valida que el usuario tenga permisos de administrador y gestiona los tickets en la base de datos.
 *
 * Funcionalidad:
 * - Verifica si el usuario está autenticado utilizando `next-auth`.
 * - Verifica si el usuario tiene permisos de administrador.
 * - Obtiene, actualiza o elimina tickets según la operación.
 * - Maneja adecuadamente los errores y devuelve respuestas HTTP apropiadas.
 */

// Función auxiliar para verificar permisos de administrador
async function verifyAdminAccess(session) {
    if (!session?.user?.email) {
        return { error: 'No autorizado', status: 401 };
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
        return { error: 'No tienes permisos de administrador', status: 403 };
    }

    return null;
}

// GET: Obtener todos los tickets (solo admin)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const accessError = await verifyAdminAccess(session);
        if (accessError) {
            return NextResponse.json(
                { error: accessError.error },
                { status: accessError.status }
            );
        }

        // Obtener todos los tickets con información del usuario
        const tickets = await prisma.ticket.findMany({
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        area: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transformar los datos para el formato esperado por el frontend
        const transformedTickets = tickets.map(ticket => {
            const diasTranscurridos = Math.floor(
                (new Date().getTime() - new Date(ticket.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return {
                id: ticket.id,
                folio: ticket.folio,
                area: ticket.area,
                service: ticket.service,
                status: ticket.status,
                createdAt: ticket.createdAt.toISOString(),
                updatedAt: ticket.updatedAt?.toISOString(), // Aseguramos que updatedAt se incluya
                requester: ticket.requester,
                description: ticket.description,
                diasTranscurridos,
                userId: ticket.userId,
                userName: ticket.user?.fullName,
                userEmail: ticket.user?.email,
                userArea: ticket.user?.area
            };
        });

        return NextResponse.json(transformedTickets);

    } catch (error) {
        console.error('Error al obtener tickets:', error);
        return NextResponse.json(
            {
                error: 'Error al obtener los tickets',
                details: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        );
    }
}

// PATCH: Actualizar el estado de un ticket
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const accessError = await verifyAdminAccess(session);
        if (accessError) {
            return NextResponse.json(
                { error: accessError.error },
                { status: accessError.status }
            );
        }

        const data = await request.json();
        const { folio, status } = data;

        if (!folio || !status) {
            return NextResponse.json(
                { error: 'Folio y status son requeridos' },
                { status: 400 }
            );
        }

        // Validar que el status sea uno de los valores permitidos
        const validStatus = ['PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'CANCELADO'] as const;
        if (!validStatus.includes(status as TicketStatus)) {
            return NextResponse.json(
                { error: 'Estado no válido' },
                { status: 400 }
            );
        }

        // Buscar el ticket primero para verificar que existe
        const existingTicket = await prisma.ticket.findUnique({
            where: { folio: folio }
        });

        if (!existingTicket) {
            return NextResponse.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Actualizar el ticket con la nueva fecha de actualización
        const updatedTicket = await prisma.ticket.update({
            where: { folio: folio },
            data: {
                status: status as TicketStatus,
                updatedAt: new Date() // Aseguramos que se actualice la fecha
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                        area: true
                    }
                }
            }
        });

        // Transformar la respuesta para mantener consistencia
        const transformedTicket = {
            id: updatedTicket.id,
            folio: updatedTicket.folio,
            area: updatedTicket.area,
            service: updatedTicket.service,
            status: updatedTicket.status,
            createdAt: updatedTicket.createdAt.toISOString(),
            updatedAt: updatedTicket.updatedAt.toISOString(), // Incluimos explícitamente updatedAt
            requester: updatedTicket.requester,
            description: updatedTicket.description,
            diasTranscurridos: Math.floor(
                (new Date().getTime() - new Date(updatedTicket.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            userId: updatedTicket.userId,
            userName: updatedTicket.user?.fullName,
            userEmail: updatedTicket.user?.email,
            userArea: updatedTicket.user?.area
        };

        return NextResponse.json(transformedTicket);

    } catch (error) {
        console.error('Error al actualizar el ticket:', error);
        return NextResponse.json(
            {
                error: 'Error al actualizar el ticket',
                details: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        );
    }
}

// DELETE: Eliminar un ticket
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const accessError = await verifyAdminAccess(session);
        if (accessError) {
            return NextResponse.json(
                { error: accessError.error },
                { status: accessError.status }
            );
        }

        const { searchParams } = new URL(request.url);
        const folio = searchParams.get('folio');

        if (!folio) {
            return NextResponse.json(
                { error: 'Folio es requerido' },
                { status: 400 }
            );
        }

        // Verificar si el ticket existe
        const existingTicket = await prisma.ticket.findUnique({
            where: { folio: folio }
        });

        if (!existingTicket) {
            return NextResponse.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Eliminar el ticket
        await prisma.ticket.delete({
            where: { folio: folio }
        });

        return NextResponse.json(
            { message: 'Ticket eliminado correctamente' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error al eliminar el ticket:', error);
        return NextResponse.json(
            {
                error: 'Error al eliminar el ticket',
                details: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        );
    }
}