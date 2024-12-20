"use client";

import Footer from "@/components/Footer";
import HeaderUser from "@/components/HeaderUser";
import { useState } from "react";

export default function CreateTicketPage() {
    const [formData, setFormData] = useState({
        area: "",
        servicioSolicitado: "",
        descripcion: "",
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Aquí puedes agregar la lógica para enviar los datos a la API
            console.log("Ticket creado:", formData);
            setMessage("Ticket creado exitosamente.");
            setFormData({ area: "", servicioSolicitado: "", descripcion: "" });
        } catch (error) {
            setMessage("Error al crear el ticket. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <HeaderUser />

            <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
                        Crear Nuevo Ticket
                    </h1>

                    {message && (
                        <div className="mb-4 p-4 rounded-md bg-blue-50 text-blue-600 text-center">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                Área
                            </label>
                            <input
                                id="area"
                                type="text"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingrese el área correspondiente"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="servicioSolicitado" className="block text-sm font-medium text-gray-700">
                                Servicio Solicitado
                            </label>
                            <input
                                id="servicioSolicitado"
                                type="text"
                                value={formData.servicioSolicitado}
                                onChange={(e) => setFormData({ ...formData, servicioSolicitado: e.target.value })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describa el servicio solicitado"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Proporcione detalles adicionales sobre el ticket"
                                rows={4}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Crear Ticket
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}