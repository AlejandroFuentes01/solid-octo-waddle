import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Obtener usuario autenticado
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Obtener último folio
        const lastTicket = await prisma.ticket.findFirst({
            orderBy: { id: 'desc' }
        });

        const newFolio = `TK${(lastTicket ? lastTicket.id + 1 : 1).toString().padStart(4, '0')}`;

        return NextResponse.json({
            folio: newFolio,
            area: user.area
        });
    } catch (error) {
        console.error('Error en la API:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}