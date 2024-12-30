"use client";

import Card from "@/components/Card";
import Footer from "@/components/Footer";
import HeaderUser from "@/components/HeaderUser";
import { PaginationControls } from "@/components/PaginationControls";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
import UserTicketDetailsModal from "@/components/UserTicketDetailsModal";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface Ticket {
    id: number;
    folio: string;
    area: string;
    service: string;
    status: "PENDIENTE" | "EN_PROCESO" | "RESUELTO" | "CANCELADO";
    createdAt: string;
    description?: string;
    diasTranscurridos: number;
}

const StatusBadge = ({ status }: { status: Ticket['status'] }) => {
    const statusConfig = {
        PENDIENTE: {
            className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
            label: "Pendiente"
        },
        EN_PROCESO: {
            className: "bg-blue-100 text-blue-800 border border-blue-200",
            label: "En Proceso"
        },
        RESUELTO: {
            className: "bg-green-100 text-green-800 border border-green-200",
            label: "Resuelto"
        },
        CANCELADO: {
            className: "bg-red-100 text-red-800 border border-red-200",
            label: "Cancelado"
        }
    };

    return (
        <span className={`px-3 py-1.5 inline-flex items-center justify-center text-xs font-medium rounded-full transition-all duration-200 ${statusConfig[status].className}`}>
            {statusConfig[status].label}
        </span>
    );
};

const TicketCard = ({ ticket, onViewDetails }: {
    ticket: Ticket;
    onViewDetails: (folio: string) => void;
}) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md">
        <div className="flex justify-between items-start mb-3">
            <div>
                <p className="text-sm font-semibold text-gray-900">{ticket.folio}</p>
                <p className="text-xs text-gray-500 mt-1">{ticket.area}</p>
            </div>
            <StatusBadge status={ticket.status} />
        </div>

        <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Servicio:</span>
                <span className="text-xs text-gray-900">{ticket.service}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Fecha:</span>
                <span className="text-xs text-gray-900">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Días:</span>
                <span className="text-xs text-gray-900">{ticket.diasTranscurridos}</span>
            </div>
        </div>

        <button
            onClick={() => onViewDetails(ticket.folio)}
            className="w-full flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-800 py-2 px-4 border border-blue-100 rounded-lg transition-all hover:bg-blue-50"
        >
            <Eye className="h-4 w-4" />
            <span>Ver Detalles</span>
        </button>
    </div>
);

export default function UserTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("todos");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/tickets/user');
                if (!response.ok) throw new Error('Error al cargar los tickets');
                const data = await response.json();
                setTickets(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

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
            ticket.area.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "todos" ||
            ticket.status === statusFilter.toUpperCase();

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
    const paginatedTickets = filteredTickets.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                    <p className="text-sm text-gray-600">Cargando tickets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <HeaderUser />

            <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mis Tickets</h1>
                    <p className="mt-2 text-gray-600">Visualiza y gestiona tus tickets de soporte técnico</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <Card className="mb-8">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="w-full md:w-96">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Buscar por folio o área..."
                                />
                            </div>
                            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
                        </div>
                    </div>
                </Card>

                {/* Vista Móvil */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paginatedTickets.length > 0 ? (
                        paginatedTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onViewDetails={handleViewDetails}
                            />
                        ))
                    ) : (
                        <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
                            No se encontraron tickets
                        </div>
                    )}
                </div>

                {/* Vista Desktop */}
                <div className="hidden lg:block">
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Días</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedTickets.length > 0 ? (
                                        paginatedTickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.folio}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.area}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{ticket.service}</td>
                                                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={ticket.status} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{ticket.diasTranscurridos}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleViewDetails(ticket.folio)}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1.5" />
                                                        <span>Ver</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                                No se encontraron tickets
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {filteredTickets.length > ITEMS_PER_PAGE && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </main>

            <Footer />

            <UserTicketDetailsModal
                ticket={selectedTicket}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTicket(null);
                }}
            />
        </div>
    );
}