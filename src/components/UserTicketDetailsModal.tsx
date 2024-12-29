'use client';

import { Briefcase, Building2, Clock, RotateCcw, Tag, User, X } from 'lucide-react';

interface Ticket {
    id: number;
    folio: string;
    area: string;
    service: string;
    status: "PENDIENTE" | "EN_PROCESO" | "RESUELTO" | "CANCELADO";
    createdAt: string;
    updatedAt?: string;
    description?: string;
    diasTranscurridos?: number;
}

interface TicketDetailsModalProps {
    ticket: Ticket | null;
    isOpen: boolean;
    onClose: () => void;
}

const UserTicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticket, isOpen, onClose }) => {
    if (!isOpen || !ticket) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Fecha no disponible';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha no válida';
            
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return 'Error en formato de fecha';
        }
    };

    const getStatusStyles = (status: Ticket['status']) => {
        const styles = {
            PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
            EN_PROCESO: 'bg-blue-50 text-blue-700 border-blue-200',
            RESUELTO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            CANCELADO: 'bg-rose-50 text-rose-700 border-rose-200'
        };
        return styles[status] || styles.PENDIENTE;
    };

    const getStatusText = (status: Ticket['status']) => {
        const text = {
            PENDIENTE: 'Pendiente',
            EN_PROCESO: 'En Proceso',
            RESUELTO: 'Resuelto',
            CANCELADO: 'Cancelado'
        };
        return text[status] || 'Pendiente';
    };

    const hasStatusUpdate = ticket.updatedAt && ticket.updatedAt !== ticket.createdAt;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]" 
                 onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-gray-400" />
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Ticket: {ticket.folio}
                                </h3>
                            </div>
                            <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Creado: {formatDate(ticket.createdAt)}
                                </p>
                                {hasStatusUpdate && (
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <RotateCcw className="h-4 w-4" />
                                        Actualizado: {formatDate(ticket.updatedAt)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Estado actual</span>
                        <span className={`px-4 py-1.5 text-sm font-medium rounded-full border ${getStatusStyles(ticket.status)}`}>
                            {getStatusText(ticket.status)}
                        </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-3">
                                    <User className="h-4 w-4" />
                                    Información del Ticket
                                </h4>
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Área</p>
                                        <p className="text-sm font-medium text-gray-900">{ticket.area}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Servicio</p>
                                        <p className="text-sm font-medium text-gray-900">{ticket.service}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-3">
                                    <Briefcase className="h-4 w-4" />
                                    Información Adicional
                                </h4>
                                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Fecha de Creación</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatDate(ticket.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Días Transcurridos</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {Math.ceil((new Date() - new Date(ticket.createdAt)) / (1000 * 60 * 60 * 24))} días
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-3">
                            <Building2 className="h-4 w-4" />
                            Descripción
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {ticket.description || 'Sin descripción'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTicketDetailsModal;