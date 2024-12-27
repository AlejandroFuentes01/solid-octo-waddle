import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from 'react';

interface PasswordChangeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    username: string;
}

const PasswordChangeDialog = ({ isOpen, onClose, userId, username }: PasswordChangeDialogProps) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);

    if (!isOpen) return null;

    const validatePassword = (password: string): boolean => {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (password.length < minLength) {
            setError(`La contraseña debe tener al menos ${minLength} caracteres`);
            return false;
        }
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            setError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!validatePassword(newPassword)) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/manage-users/${userId}/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newPassword,
                    adminPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al cambiar la contraseña');
            }

            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
            setAdminPassword('');
            
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 1500); // Cerrar el diálogo después de 1.5 segundos, solo si hay éxito
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = (field: 'new' | 'confirm' | 'admin') => {
        switch (field) {
            case 'new':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword);
                break;
            case 'admin':
                setShowAdminPassword(!showAdminPassword);
                break;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">
                        Cambiar contraseña de {username}
                    </h2>
                </div>

                {success && (
                    <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
                        <h3 className="text-green-800 font-semibold">¡Éxito!</h3>
                        <p className="text-green-700">
                            La contraseña ha sido actualizada correctamente.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa la nueva contraseña"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirma la nueva contraseña"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tu contraseña (administrador)
                        </label>
                        <div className="relative">
                            <input
                                type={showAdminPassword ? "text" : "password"}
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ingresa tu contraseña de administrador"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('admin')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-md bg-red-50 border border-red-200">
                            <h3 className="text-red-800 font-semibold">Error</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeDialog;