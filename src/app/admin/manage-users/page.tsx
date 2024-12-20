"use client";
import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";
import { Pencil, Search, Trash2, UserCog } from "lucide-react";
import { useState } from "react";

// Tipo para los usuarios
type User = {
    id: number;
    username: string;
    area: string;
    role: string;
    createdAt: string;
};

export default function ManageUsersPage() {
    // Estado para la búsqueda
    const [searchTerm, setSearchTerm] = useState("");

    // Datos de ejemplo - Reemplazar con datos reales de tu API
    const [users] = useState<User[]>([
        {
            id: 1,
            username: "juan.perez",
            area: "Recursos Humanos",
            role: "normal",
            createdAt: "2024-01-15",
        },
        {
            id: 2,
            username: "maria.garcia",
            area: "Contabilidad",
            role: "admin",
            createdAt: "2024-01-16",
        },
        // Agregar más usuarios de ejemplo
    ]);

    // Filtrar usuarios basado en el término de búsqueda
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (userId: number) => {
        // Implementar lógica de edición
        console.log("Editar usuario:", userId);
    };

    const handleDelete = (userId: number) => {
        // Implementar lógica de eliminación
        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            console.log("Eliminar usuario:", userId);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderAdmin />

            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        {/* Encabezado y Búsqueda */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-2">
                                <UserCog className="h-6 w-6 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Gestión de Usuarios
                                </h1>
                            </div>
                            <div className="w-full md:w-64 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar usuarios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Tabla de Usuarios */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Área
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha de Creación
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {user.username}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {user.area}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {user.role === 'admin' ? 'Administrador' : 'Usuario Normal'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => handleEdit(user.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                                                        >
                                                            <Pencil className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                No se encontraron usuarios
                                            </td>
                                        </tr>
                                    )}
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