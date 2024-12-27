// src/app/not-found.tsx
import ErrorLayout from '@/components/errors/ErrorLayout';

export default function NotFound() {
    return (
        <ErrorLayout
            errorCode="404"
            title="Página no encontrada"
            message="Lo sentimos, la página que estás buscando no existe o ha sido movida."
        />
    );
}