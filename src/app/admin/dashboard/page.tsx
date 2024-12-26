"use client";

import Card from "@/components/Card";
import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
import { Eye, RefreshCw } from "lucide-react";
import { useState } from "react";

interface Ticket {
    folio: number;
    area: string;
    servicioSolicitado: string;
    estatus: "Pendiente" | "En Proceso" | "Finalizado";
    fecha: string;
    solicitante: string;
    diasTranscurridos: number;
}

const StatusBadge = ({ status }: { status: Ticket['estatus'] }) => {
    const statusStyles = {
        Pendiente: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        "En Proceso": "bg-blue-100 text-blue-800 border border-blue-200",
        Finalizado: "bg-green-100 text-green-800 border border-green-200"
    };

    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]} transition-all duration-200 hover:shadow-sm`}>
            {status}
        </span>
    );
};

const ActionButtons = ({
    folio,
    onViewDetails,
    onStatusChange
}: {
    folio: number;
    onViewDetails: (folio: number) => void;
    onStatusChange: (folio: number) => void;
}) => {
    return (
        <div className="flex space-x-4">
            <button
                onClick={() => onViewDetails(folio)}
                className="text-blue-600 hover:text-blue-800 inline-flex items-center transition-all duration-200 hover:scale-105"
            >
                <Eye className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline text-sm font-medium">Ver detalles</span>
            </button>
            <button
                onClick={() => onStatusChange(folio)}
                className="text-green-600 hover:text-green-800 inline-flex items-center transition-all duration-200 hover:scale-105"
            >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline text-sm font-medium">Cambiar estado</span>
            </button>
        </div>
    );
};

const TicketTable = ({ 
    tickets, 
    onViewDetails, 
    onStatusChange 
}: { 
    tickets: Ticket[],
    onViewDetails: (folio: number) => void,
    onStatusChange: (folio: number) => void
}) => {
    return (
        <div className="w-full">
            {/* Tabla para pantallas medianas y grandes */}
            <div className="hidden md:block overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Folio
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Área
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Servicio
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Estatus
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Solicitante
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Días
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket, index) => (
                            <tr 
                                key={ticket.folio} 
                                className={`
                                    transition-colors duration-200 hover:bg-gray-50
                                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                                `}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                        #{ticket.folio}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {ticket.area}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                    {ticket.servicioSolicitado}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={ticket.estatus} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(ticket.fecha).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {ticket.solicitante}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                                        {ticket.diasTranscurridos}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <ActionButtons
                                        folio={ticket.folio}
                                        onViewDetails={onViewDetails}
                                        onStatusChange={onStatusChange}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista de tarjetas para móviles */}
            <div className="md:hidden space-y-4">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.folio} 
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all duration-200 hover:shadow-md"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mb-2">
                                    #{ticket.folio}
                                </span>
                                <h3 className="text-lg font-semibold text-gray-900">{ticket.area}</h3>
                            </div>
                            <StatusBadge status={ticket.estatus} />
                        </div>
                        
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-sm font-medium text-gray-600">Servicio</span>
                                <p className="text-sm text-gray-900 mt-1">{ticket.servicioSolicitado}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Solicitante</span>
                                    <p className="text-sm text-gray-900 mt-1">{ticket.solicitante}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <span className="text-sm font-medium text-gray-600">Fecha</span>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {new Date(ticket.fecha).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">Días transcurridos</span>
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-700 text-sm font-medium shadow-sm">
                                        {ticket.diasTranscurridos}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end space-x-4 border-t pt-4">
                            <ActionButtons
                                folio={ticket.folio}
                                onViewDetails={onViewDetails}
                                onStatusChange={onStatusChange}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    const [tickets] = useState<Ticket[]>([
        {
            folio: 1,
            area: "Catastro",
            servicioSolicitado: "Instalación de impresora",
            estatus: "Pendiente",
            fecha: "2024-03-19",
            solicitante: "Juan Pérez",
            diasTranscurridos: 2,
        },
        {
            folio: 2,
            area: "Tesorería",
            servicioSolicitado: "Configuración de correo",
            estatus: "En Proceso",
            fecha: "2024-03-18",
            solicitante: "María García",
            diasTranscurridos: 3,
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("todos");
    const [showAnimation, setShowAnimation] = useState(false);

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.folio.toString().includes(searchTerm.toLowerCase()) ||
            ticket.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.solicitante.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "todos" ||
            ticket.estatus.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (folio: number) => {
        console.log("Cambiar estatus del ticket:", folio);
    };

    const handleViewDetails = (folio: number) => {
        console.log("Ver detalles del ticket:", folio);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <style jsx global>{`
                @keyframes moveRightToLeft {
                    0% {
                        transform: translateX(100vw);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }

                .moving-gif {
                    animation: moveRightToLeft 15s linear infinite;
                }

                @media (max-width: 768px) {
                    .animation-controls,
                    .gif-container {
                        display: none !important;
                    }
                }
            `}</style>

            <HeaderAdmin />

            <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
                        <p className="text-gray-600 mt-2">Gestión de tickets de soporte técnico</p>
                    </div>

                    <div className="animation-controls flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm">
                        <span className="text-sm font-medium text-gray-700">Nezuko Corriendo</span>
                        <button
                            onClick={() => setShowAnimation(!showAnimation)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showAnimation ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showAnimation ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                </div>

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

                <Card>
                    {filteredTickets.length > 0 ? (
                        <TicketTable
                            tickets={filteredTickets}
                            onViewDetails={handleViewDetails}
                            onStatusChange={handleStatusChange}
                        />
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 text-lg">No se encontraron tickets</p>
                        </div>
                    )}
                </Card>
            </main>

            {showAnimation && (
                <div className="gif-container relative h-32 overflow-hidden">
                    <div className="absolute bottom-0 w-full">
                        <img
                            src="/nezuko.gif"
                            alt="Nezuko GIF"
                            className="moving-gif w-32 h-32"
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}