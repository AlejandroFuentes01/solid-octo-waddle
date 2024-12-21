"use client";

import Footer from "@/components/Footer";
import HeaderUser from "@/components/HeaderUser";
import { useEffect, useState } from "react";

export default function CreateTicketPage() {
    const [formData, setFormData] = useState({
        folio: "",
        fecha: "",
        area: "Soporte Técnico",
        servicioSolicitado: "",
        descripcion: "",
    });

    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const generateFolio = () => `TKT-${Date.now()}`;
        const currentDate = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setFormData(prev => ({
            ...prev,
            folio: generateFolio(),
            fecha: currentDate,
        }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de API
            console.log("Ticket creado:", formData);
            setMessage("Ticket creado exitosamente.");
            setFormData({
                folio: "",
                fecha: "",
                area: "Soporte Técnico",
                servicioSolicitado: "",
                descripcion: "",
            });
        } catch (error) {
            setMessage("Error al crear el ticket. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const readOnlyInputClass = "w-full rounded-md border border-gray-200 px-4 py-2.5 bg-gray-50 text-gray-600 font-medium";
    const inputClass = "w-full rounded-md border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-gray-100">
            <HeaderUser />

            <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Crear Nuevo Ticket
                        </h1>
                        <p className="text-gray-600">Complete los detalles para crear un nuevo ticket de soporte</p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
                            message.includes('error')
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="folio" className="block text-sm font-semibold text-gray-700">
                                    Folio
                                </label>
                                <input
                                    id="folio"
                                    type="text"
                                    value={formData.folio}
                                    readOnly
                                    className={readOnlyInputClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="fecha" className="block text-sm font-semibold text-gray-700">
                                    Fecha
                                </label>
                                <input
                                    id="fecha"
                                    type="text"
                                    value={formData.fecha}
                                    readOnly
                                    className={readOnlyInputClass}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="area" className="block text-sm font-semibold text-gray-700">
                                Área Asignada
                            </label>
                            <input
                                id="area"
                                type="text"
                                value={formData.area}
                                readOnly
                                className={readOnlyInputClass}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="servicioSolicitado" className="block text-sm font-semibold text-gray-700">
                                Servicio Solicitado
                            </label>
                            <input
                                id="servicioSolicitado"
                                type="text"
                                value={formData.servicioSolicitado}
                                onChange={(e) => setFormData({ ...formData, servicioSolicitado: e.target.value })}
                                className={inputClass}
                                placeholder="Ej: Instalación de software, Configuración de red..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700">
                                Descripción Detallada
                            </label>
                            <textarea
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className={`${inputClass} resize-none`}
                                placeholder="Describa detalladamente el problema o solicitud..."
                                rows={5}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                                w-full py-3 px-4 rounded-lg text-white font-medium
                                transition-all duration-200 transform
                                ${isSubmitting 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-98'}
                            `}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creando Ticket...
                                </span>
                            ) : 'Crear Ticket'}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}