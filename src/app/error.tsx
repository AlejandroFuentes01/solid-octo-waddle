'use client';

import ErrorLayout from '@/components/errors/ErrorLayout';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <ErrorLayout
            errorCode="500"
            title="Error del Servidor"
            message="Ha ocurrido un error en nuestros servidores. Por favor, intenta de nuevo más tarde."
        />
    );
}
