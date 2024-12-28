"use client";

import Card from "@/components/Card";
import Footer from "@/components/Footer";
import HeaderUser from "@/components/HeaderUser";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface Ticket {
    folio: number;
    area: string;
    servicioSolicitado: string;
    estatus: "Pendiente" | "En Proceso" | "Finalizado";
    fecha: string;
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

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.folio.toString().includes(searchTerm.toLowerCase()) ||
            ticket.area.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "todos" ||
            ticket.estatus.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (folio: number) => {
        console.log("Ver detalles del ticket:", folio);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <HeaderUser />

            <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Mis Tickets</h1>
                        <p className="text-gray-600 mt-1">Visualiza y gestiona los tickets que has creado</p>
                    </div>
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
                                    placeholder="Buscar por folio o área..."
                                />
                            </div>
                            <StatusFilter value={statusFilter} onChange={setStatusFilter} />
                        </div>
                    </div>
                </Card>

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
                                        Servicio Solicitado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estatus
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Días Transcurridos
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
                                        <tr key={ticket.folio} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{ticket.folio}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ticket.area}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {ticket.servicioSolicitado}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        ticket.estatus === "Pendiente"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : ticket.estatus === "En Proceso"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {ticket.estatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(ticket.fecha).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {ticket.diasTranscurridos}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleViewDetails(ticket.folio)}
                                                        className="text-blue-600 hover:text-blue-800 inline-flex items-center transition-colors duration-200"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Ver
                                                    </button>
                                                </div>
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
            </main>

            <Footer />
        </div>
    );
}