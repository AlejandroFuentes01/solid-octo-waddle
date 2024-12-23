import { Lock, Mail, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import AreaSelector from './AreaSelector';

interface FormData {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    area: string;
    role: string;
}

type MessageType = 'success' | 'error' | 'info';

const initialFormData: FormData = {
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    area: "",
    role: "normal",
};

const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (password.length < minLength) {
        return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return "La contraseña debe contener mayúsculas, minúsculas y números";
    }
    return null;
};

export default function CreateUserForm() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<MessageType>('info');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setIsSubmitting(true);

        try {
            // Validación de contraseñas
            if (formData.password !== formData.confirmPassword) {
                setMessage("Las contraseñas no coinciden");
                setMessageType('error');
                return;
            }

            // Validación de contraseña
            const passwordError = validatePassword(formData.password);
            if (passwordError) {
                setMessage(passwordError);
                setMessageType('error');
                return;
            }

            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    role: formData.role.toUpperCase()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (Array.isArray(data.error)) {
                    setMessage(data.error.join(', '));
                    setMessageType('error');
                } else if (typeof data.error === 'string') {
                    setMessage(data.error);
                    setMessageType('error');
                } else {
                    throw new Error('Error desconocido');
                }
                return;
            }

            setMessage("Usuario creado exitosamente");
            setMessageType('success');
            setFormData(initialFormData);
            
        } catch (error) {
            setMessage("Error al conectar con el servidor");
            setMessageType('error');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div className={`p-4 rounded-lg animate-fade-in ${
                    messageType === 'success' ? 'bg-green-50 text-green-600 border border-green-100' :
                    messageType === 'error' ? 'bg-red-50 text-red-600 border border-red-100' :
                    'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                    {message}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Nombre Completo
                </label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Ingrese nombre completo"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nombre de Usuario
                </label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    <input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Ingrese nombre de usuario"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                </label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Ingrese correo electrónico"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pl-10 pr-10 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            placeholder="Ingrese contraseña"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.067l-1.78-1.774zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.645 2.644l1.514 1.514a4 4 0 00-5.674-5.673z" clipRule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .817 0 1.614-.107 2.37-.306z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmar Contraseña
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="pl-10 pr-10 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            placeholder="Confirme contraseña"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                        >
                            {showConfirmPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.067l-1.78-1.774zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.645 2.644l1.514 1.514a4 4 0 00-5.674-5.673z" clipRule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .817 0 1.614-.107 2.37-.306z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                    Área
                </label>
                <AreaSelector
                    selectedArea={formData.area}
                    setSelectedArea={(area) => setFormData({ ...formData, area })}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Rol de Usuario
                </label>
                <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    required
                >
                    <option value="normal">Usuario Normal</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center space-x-2 mt-8"
            >
                <UserPlus className="h-5 w-5" />
                <span>Crear Usuario</span>
            </button>
        </form>
    );
}