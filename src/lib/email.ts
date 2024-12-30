// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplateProps {
    userName: string;
    ticketFolio: string;
    newStatus: string;
    ticketService: string;
}

export const sendStatusChangeEmail = async ({
    userEmail,
    userName,
    ticketFolio,
    newStatus,
    ticketService
}: EmailTemplateProps & { userEmail: string }) => {
    const statusDisplay = {
        PENDIENTE: "Pendiente",
        EN_PROCESO: "En Proceso",
        RESUELTO: "Resuelto",
        CANCELADO: "Cancelado"
    };

    try {
        await resend.emails.send({
            from: 'Sistema de Tickets <tickets@tudominio.com>',
            to: userEmail,
            subject: `Actualización del estado de tu ticket ${ticketFolio}`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hola ${userName},</h2>
          
          <p>Te informamos que el estado de tu ticket ha sido actualizado:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Folio:</strong> ${ticketFolio}</p>
            <p><strong>Servicio:</strong> ${ticketService}</p>
            <p><strong>Nuevo Estado:</strong> ${statusDisplay[newStatus]}</p>
          </div>
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          
          <p style="color: #666; font-size: 14px;">Saludos,<br>Equipo de Soporte Técnico</p>
        </div>
      `,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send status update email');
    }
};