import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { TicketStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Función para enviar correo de notificación
const sendStatusChangeEmail = async ({
    userEmail,
    userName,
    ticketFolio,
    newStatus,
    ticketService
}: {
    userEmail: string,
    userName: string,
    ticketFolio: string,
    newStatus: string,
    ticketService: string
}) => {
    const statusDisplay = {
        PENDIENTE: "Pendiente",
        EN_PROCESO: "En Proceso",
        RESUELTO: "Resuelto",
        CANCELADO: "Cancelado"
    };

    try {
        await resend.emails.send({
                from: 'Telemática<ticketstelematica@resend.dev>',
                to: userEmail,
                subject: `Actualización de Ticket de Soporte Técnico - ${ticketFolio}`,
                html: `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header with Logo -->
                    <div style="text-align: center; margin-bottom: 35px;">
                        <img src="http://comala.gob.mx//storage/settings/logo2427.jpg" alt="Logo DGTI" style="max-width: 180px; height: auto;">
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #e2e8f0;">
                            <h1 style="color: #1a365d; font-size: 22px; margin: 0;">Dirección General de Tecnologías de Información</h1>
                            <p style="color: #2d3748; font-size: 16px; margin: 5px 0 0 0;">Departamento de Telemática</p>
                        </div>
                    </div>
            
                    <!-- Main Content -->
                    <div style="border-left: 5px solid #2563eb; padding-left: 25px; margin-bottom: 35px; background: linear-gradient(to right, #f8fafc, #ffffff);">
                        <h2 style="color: #1e293b; font-size: 24px; margin: 0 0 15px 0;">Hola ${userName},</h2>
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
                            Te informamos que se ha actualizado el estado de tu solicitud de soporte técnico.
                        </p>
                    </div>
            
                    <!-- Ticket Details Card -->
                    <div style="background: linear-gradient(145deg, #f8fafc, #f1f5f9); border: 1px solid #e2e8f0; border-radius: 10px; padding: 30px; margin: 30px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                        <div style="margin-bottom: 20px;">
                            <p style="color: #64748b; font-size: 14px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Folio de Seguimiento</p>
                            <p style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">${ticketFolio}</p>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <p style="color: #64748b; font-size: 14px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Servicio Solicitado</p>
                            <p style="color: #0f172a; font-size: 18px; font-weight: 700; margin: 0;">${ticketService}</p>
                        </div>
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 14px; font-weight: 600; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">Estado Actual</p>
                            <p style="display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 16px; font-weight: 600; padding: 8px 16px; border-radius: 8px; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">${statusDisplay[newStatus]}</p>
                        </div>
                    </div>
            
                    <!-- Contact Section -->
                    <div style="margin-top: 35px; padding: 30px; background-color: #f8fafc; border-radius: 10px;">
                        <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 20px 0; text-align: center;">Información de Contacto</h3>
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; text-align: center;">
                            Para cualquier duda o aclaración sobre tu solicitud, puedes contactarnos a través de los siguientes medios:
                        </p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                            <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Teléfono</p>
                                <p style="margin: 0; color: #0f172a; font-size: 16px; font-weight: 600;">312 167 6789</p>
                            </div>
                            <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Correo Electrónico</p>
                                <p style="margin: 0; color: #0f172a; font-size: 16px; font-weight: 600;">telematica@comala.gob.mx</p>
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <a href="mailto:telematica@comala.gob.mx" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">Contactar Soporte</a>
                        </div>
                    </div>
            
                    <!-- Footer -->
                    <div style="margin-top: 40px; padding-top: 25px; border-top: 2px solid #e2e8f0; text-align: center;">
                        <p style="color: #475569; font-size: 15px; margin: 0; font-weight: 500;">Atentamente,<br><strong>Departamento de Telemática</strong></p>
                        <div style="margin-top: 25px;">
                            <p style="color: #64748b; font-size: 12px; margin: 0;">H. Ayuntamiento de Comala © ${new Date().getFullYear()}</p>
                            <p style="color: #94a3b8; font-size: 11px; margin: 8px 0 0 0;">Este es un correo automático, por favor no responder a este mensaje.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>`
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send status update email');
    }
};

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
                updatedAt: ticket.updatedAt?.toISOString(),
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

        // Buscar el ticket con la información del usuario
        const existingTicket = await prisma.ticket.findUnique({
            where: { folio: folio },
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

        if (!existingTicket) {
            return NextResponse.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Actualizar el ticket
        const updatedTicket = await prisma.ticket.update({
            where: { folio: folio },
            data: {
                status: status as TicketStatus,
                updatedAt: new Date()
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

        // Enviar notificación por correo
        if (updatedTicket.user?.email) {
            try {
                await sendStatusChangeEmail({
                    userEmail: updatedTicket.user.email,
                    userName: updatedTicket.user.fullName || 'Usuario',
                    ticketFolio: updatedTicket.folio,
                    newStatus: updatedTicket.status,
                    ticketService: updatedTicket.service
                });
            } catch (emailError) {
                console.error('Error al enviar correo de notificación:', emailError);
                // No detenemos el flujo si falla el envío del correo
            }
        }

        // Transformar la respuesta
        const transformedTicket = {
            id: updatedTicket.id,
            folio: updatedTicket.folio,
            area: updatedTicket.area,
            service: updatedTicket.service,
            status: updatedTicket.status,
            createdAt: updatedTicket.createdAt.toISOString(),
            updatedAt: updatedTicket.updatedAt.toISOString(),
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