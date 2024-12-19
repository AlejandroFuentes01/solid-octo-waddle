"use client";
import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";
import { Eye, RefreshCw } from "lucide-react";
import { useState } from "react";

// Tipos para nuestros datos
interface Ticket {
    folio: number;
    area: string;
    servicioSolicitado: string;
    estatus: "Pendiente" | "En Proceso" | "Finalizado";
    fecha: string;
    solicitante: string;
    diasTranscurridos: number;
}

export default function AdminDashboard() {
    // Estado para los tickets (aquí podrías fetchear los datos reales de tu API)
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
        // Más tickets de ejemplo...
    ]);

    // Función para manejar el cambio de estatus
    const handleStatusChange = (folio: number) => {
        // Aquí implementarías la lógica para cambiar el estatus
        console.log("Cambiar estatus del ticket:", folio);
    };

    // Función para ver detalles
    const handleViewDetails = (folio: number) => {
        // Aquí implementarías la lógica para ver detalles
        console.log("Ver detalles del ticket:", folio);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderAdmin />
            <main className="flex-grow bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Encabezado de la página */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
                        <p className="text-gray-600">Gestión de tickets de soporte técnico</p>
                    </div>

                    {/* Tabla de tickets */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Solicitante
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Días
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tickets.map((ticket) => (
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
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${ticket.estatus === "Pendiente"
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ticket.solicitante}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {ticket.diasTranscurridos}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(ticket.folio)}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Ver
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(ticket.folio)}
                                                    className="text-green-600 hover:text-green-900 inline-flex items-center ml-2"
                                                >
                                                    <RefreshCw className="h-4 w-4 mr-1" />
                                                    Estado
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}