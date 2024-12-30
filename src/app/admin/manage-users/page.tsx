"use client";

import DeleteConfirmationDialog from "@/components/DeteleConfirmationDialog";
import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";
import PasswordChangeDialog from '@/components/PasswordChangeDialog';
import Toast from "@/components/Toast";
import { Building, Calendar, Mail, Pencil, Search, Trash2, UserCog } from "lucide-react";
import { useEffect, useState } from "react";

type User = {
    id: number;
    username: string;
    email: string;
    fullName: string;
    area: string;
    role: string;
    createdAt: string;
};

type ToastState = {
    show: boolean;
    message: string;
    type: "success" | "error";
};

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "success"
    });


    const fetchUsers = async (search: string = "") => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(`/api/manage-users?search=${encodeURIComponent(search)}`, {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cargar los usuarios');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los usuarios');
            setUsers([]); // Limpiar usuarios en caso de error
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar usuarios iniciales
    useEffect(() => {
        fetchUsers();
    }, []);

    // Manejar búsqueda con debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== "") {
                fetchUsers(searchTerm);
            } else {
                fetchUsers();
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setError(null);
    };

    const handleEdit = (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsPasswordDialogOpen(true);
        }
    };

    // Eliminar usuario
    const handleDelete = (userId: number) => {
        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            const response = await fetch(`/api/manage-users/${userToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            setUsers(users.filter(user => user.id !== userToDelete));
            setToast({
                show: true,
                message: "Usuario eliminado correctamente",
                type: "success"
            });
        } catch (error) {
            console.error('Error:', error);
            setToast({
                show: true,
                message: "Error al eliminar el usuario",
                type: "error"
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderAdmin />

            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        {/* Header y búsqueda */}
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
                                    placeholder="Buscar por nombre o usuario..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Loading y Error states */}
                        {isLoading && (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-600 bg-red-50 p-4 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        {/* Vista de tabla para desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre Completo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Área
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
                                    {!isLoading && users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {user.username}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {user.fullName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {user.area}
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
                                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                {!isLoading && (searchTerm ? "No se encontraron usuarios con ese criterio de búsqueda" : "No se encontraron usuarios")}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Vista de tarjetas para mobile */}
                        <div className="md:hidden space-y-4">
                            {!isLoading && users.length > 0 ? (
                                users.map((user) => (
                                    <div key={user.id} className="bg-white border rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {user.fullName}
                                                </h3>
                                                <p className="text-sm text-gray-600">@{user.username}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(user.id)}
                                                    className="text-indigo-600 p-1 hover:bg-indigo-50 rounded-full"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-red-600 p-1 hover:bg-red-50 rounded-full"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Mail className="h-4 w-4 mr-2" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Building className="h-4 w-4 mr-2" />
                                                {user.area}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    {!isLoading && (searchTerm ? "No se encontraron usuarios con ese criterio de búsqueda" : "No se encontraron usuarios")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Password Change Dialog */}
            {selectedUser && (
                <PasswordChangeDialog
                    isOpen={isPasswordDialogOpen}
                    onClose={() => {
                        setIsPasswordDialogOpen(false);
                        setSelectedUser(null);
                    }}
                    userId={selectedUser.id}
                    username={selectedUser.username}
                />
            )}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
}