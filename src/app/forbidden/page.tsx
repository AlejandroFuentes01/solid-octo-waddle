// src/app/forbidden/page.tsx
import ErrorLayout from '@/components/errors/ErrorLayout';

export default function Forbidden() {
    return (
        <ErrorLayout
            errorCode="403"
            title="Acceso Denegado"
            message="No tienes permisos para acceder a esta página. Por favor, contacta al administrador si crees que esto es un error."
        />
    );
}