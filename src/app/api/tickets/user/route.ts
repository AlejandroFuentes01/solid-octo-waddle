import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Obtener los tickets del usuario autenticado
        const tickets = await prisma.ticket.findMany({
            where: {
                requester: session.user.email
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                folio: true,
                area: true,
                service: true,
                status: true,
                description: true,
                createdAt: true,
            }
        });

        // Transformar los datos para incluir días transcurridos
        const transformedTickets = tickets.map(ticket => {
            const fechaCreacion = new Date(ticket.createdAt);
            const hoy = new Date();
            const diasTranscurridos = Math.floor(
                (hoy.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24)
            );

            return {
                ...ticket,
                diasTranscurridos
            };
        });

        return NextResponse.json(transformedTickets, { status: 200 });

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