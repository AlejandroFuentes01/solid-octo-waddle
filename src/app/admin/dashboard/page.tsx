"use client";

import Card from "@/components/Card";
import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
import TicketDetailsModal from "@/components/TicketDetailsModal";
import { Eye, RefreshCw, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Ticket {
    id: number;
    folio: string;
    area: string;
    service: string;
    status: "PENDIENTE" | "EN_PROCESO" | "RESUELTO" | "CANCELADO";
    createdAt: string;
    requester: string;
    description?: string;
    diasTranscurridos: number;
}

interface StatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (status: string) => void;
    currentStatus: string;
}

const StatusBadge = ({ status }: { status: Ticket['status'] }) => {
    const statusStyles = {
        PENDIENTE: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        EN_PROCESO: "bg-blue-100 text-blue-800 border border-blue-200",
        RESUELTO: "bg-green-100 text-green-800 border border-green-200",
        CANCELADO: "bg-red-100 text-red-800 border border-red-200"
    };

    const statusDisplay = {
        PENDIENTE: "Pendiente",
        EN_PROCESO: "En Proceso",
        RESUELTO: "Resuelto",
        CANCELADO: "Cancelado"
    };

    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]} transition-all duration-200 hover:shadow-sm`}>
            {statusDisplay[status]}
        </span>
    );
};

const StatusChangeModal = ({ isOpen, onClose, onStatusChange, currentStatus }: StatusChangeModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const statusOptions = [
        { value: "PENDIENTE", label: "Pendiente" },
        { value: "EN_PROCESO", label: "En Proceso" },
        { value: "RESUELTO", label: "Resuelto" },
        { value: "CANCELADO", label: "Cancelado" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Cambiar Estado del Ticket</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-500">
                        Estado actual: <span className="font-medium">{currentStatus}</span>
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onStatusChange(option.value);
                                    onClose();
                                }}
                                disabled={option.value === currentStatus}
                                className={`p-3 text-sm font-medium rounded-lg transition-all
                                    ${option.value === currentStatus
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

const TicketCard = ({ ticket, onStatusChange, onViewDetails }: {
    ticket: Ticket;
    onStatusChange: (folio: string) => void;
    onViewDetails: (folio: string) => void;
}) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
            <div>
                <p className="text-sm font-semibold text-gray-900">{ticket.folio}</p>
                <p className="text-xs text-gray-500 mt-1">{ticket.area}</p>
            </div>
            <StatusBadge status={ticket.status} />
        </div>

        <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Servicio:</span>
                <span className="text-xs text-gray-900">{ticket.service}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Solicitante:</span>
                <span className="text-xs text-gray-900">{ticket.requester}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Fecha:</span>
                <span className="text-xs text-gray-900">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Días transcurridos:</span>
                <span className="text-xs text-gray-900">{ticket.diasTranscurridos}</span>
            </div>
        </div>

        <div className="flex space-x-2">
            <button
                onClick={() => onViewDetails(ticket.folio)}
                className="flex-1 flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-800 py-2 border border-blue-100 rounded-md transition-all hover:bg-blue-50"
            >
                <Eye className="h-4 w-4" />
                <span>Ver Detalles</span>
            </button>
            <button
                onClick={() => onStatusChange(ticket.folio)}
                className="flex-1 flex items-center justify-center space-x-2 text-sm text-green-600 hover:text-green-800 py-2 border border-green-100 rounded-md transition-all hover:bg-green-50"
            >
                <RefreshCw className="h-4 w-4" />
                <span>Cambiar Estado</span>
            </button>
        </div>
    </div>
);

export default function AdminDashboard() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("todos");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedTicketForStatus, setSelectedTicketForStatus] = useState<Ticket | null>(null);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/tickets');

            if (!response.ok) {
                throw new Error('Error al cargar los tickets');
            }

            const data = await response.json();
            setTickets(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleStatusChange = (folio: string) => {
        const ticket = tickets.find(t => t.folio === folio);
        if (ticket) {
            setSelectedTicketForStatus(ticket);
            setIsStatusModalOpen(true);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!selectedTicketForStatus) return;

        try {
            const response = await fetch('/api/admin/tickets', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folio: selectedTicketForStatus.folio,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado');
            }

            await fetchTickets();
            setIsStatusModalOpen(false);
            setSelectedTicketForStatus(null);
        } catch (err) {
            alert('Error al actualizar el estado del ticket');
        }
    };

    const handleViewDetails = (folio: string) => {
        const ticket = tickets.find(t => t.folio === folio);
        if (ticket) {
            setSelectedTicket(ticket);
            setIsModalOpen(true);
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.requester.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "todos" ||
            ticket.status === statusFilter.toUpperCase();

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <HeaderAdmin />

            <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
                    <p className="text-gray-600 mt-2">Gestión de tickets de soporte técnico</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <Card className="mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-96">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Buscar por folio, área o solicitante..."
                                />
                            </div>
                            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
                        </div>
                    </div>
                </Card>

                {/* Mobile View */}
                <div className="md:hidden">
                    {filteredTickets.length > 0 ? (
                        <div className="space-y-4">
                            {filteredTickets.map((ticket) => (
                                <TicketCard
                                    key={ticket.id}
                                    ticket={ticket}
                                    onStatusChange={handleStatusChange}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            No se encontraron tickets
                        </div>
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Días</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTickets.length > 0 ? (
                                        filteredTickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.folio}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.area}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{ticket.service}</td>
                                                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={ticket.status} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.requester}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{ticket.diasTranscurridos}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-4">
                                                        <button
                                                            onClick={() => handleViewDetails(ticket.folio)}
                                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-50 transition-all"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                            <span className="hidden lg:inline">Ver Detalles</span> {/* Solo visible en grandes resoluciones */}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(ticket.folio)}
                                                            className="flex items-center space-x-2 text-green-600 hover:text-green-900 px-3 py-1 rounded-md hover:bg-green-50 transition-all"
                                                        >
                                                            <RefreshCw className="h-5 w-5" />
                                                            <span className="hidden lg:inline">Cambiar Estado</span> {/* Solo visible en grandes resoluciones */}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                                No se encontraron tickets
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />

            <TicketDetailsModal
                ticket={selectedTicket}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTicket(null);
                }}
            />

            <StatusChangeModal
                isOpen={isStatusModalOpen}
                onClose={() => {
                    setIsStatusModalOpen(false);
                    setSelectedTicketForStatus(null);
                }}
                onStatusChange={handleStatusUpdate}
                currentStatus={selectedTicketForStatus?.status || ''}
            />
        </div>
    );
}