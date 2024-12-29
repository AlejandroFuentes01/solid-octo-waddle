"use client";

import Card from "@/components/Card";
import Footer from "@/components/Footer";
import HeaderUser from "@/components/HeaderUser";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
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

export default function UserTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("todos");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/tickets/user');
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al cargar los tickets');
                }
                
                const data = await response.json();
                setTickets(data);
            } catch (error) {
                console.error('Error al cargar los tickets:', error);
                setError(error instanceof Error ? error.message : 'Error al cargar los tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'PENDIENTE':
                return "bg-yellow-100 text-yellow-800";
            case 'EN_PROCESO':
                return "bg-blue-100 text-blue-800";
            case 'RESUELTO':
                return "bg-green-100 text-green-800";
            case 'CANCELADO':
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.area.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "todos" ||
            ticket.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (folio: string) => {
        console.log("Ver detalles del ticket:", folio);
    };

    // Componente para la vista de tarjeta en móvil
    const TicketCard = ({ ticket }: { ticket: Ticket }) => (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-sm font-semibold text-gray-900">{ticket.folio}</p>
                    <p className="text-xs text-gray-500 mt-1">{ticket.area}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                </span>
            </div>
            
            <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Servicio:</span>
                    <span className="text-xs text-gray-900">{ticket.service}</span>
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
            
            <button
                onClick={() => handleViewDetails(ticket.folio)}
                className="w-full mt-2 flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-800 py-2 border border-blue-100 rounded-md transition-all hover:bg-blue-50"
            >
                <Eye className="h-4 w-4" />
                <span>Ver Detalles</span>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <HeaderUser />

            <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Mis Tickets</h1>
                    <p className="text-gray-600 mt-1">Visualiza y gestiona los tickets que has creado</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <Card className="mb-6">
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="w-full sm:w-96">
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

                {/* Vista móvil (cards) */}
                <div className="md:hidden">
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">
                            Cargando tickets...
                        </div>
                    ) : filteredTickets.length > 0 ? (
                        <div className="space-y-4">
                            {filteredTickets.map((ticket) => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            No se encontraron tickets
                        </div>
                    )}
                </div>

                {/* Vista desktop (tabla) */}
                <div className="hidden md:block">
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Folio
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Área
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Servicio
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Días
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                Cargando tickets...
                                            </td>
                                        </tr>
                                    ) : filteredTickets.length > 0 ? (
                                        filteredTickets.map((ticket) => (
                                            <tr key={ticket.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {ticket.folio}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {ticket.area}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {ticket.service}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                                                        {ticket.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {ticket.diasTranscurridos}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleViewDetails(ticket.folio)}
                                                        className="text-blue-600 hover:text-blue-800 inline-flex items-center transition-colors duration-200"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Ver Detalles
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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
        </div>
    );
}