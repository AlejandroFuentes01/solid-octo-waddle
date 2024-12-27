import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ErrorLayoutProps {
    errorCode: string;
    title: string;
    message: string;
}

const ErrorLayout: React.FC<ErrorLayoutProps> = ({ errorCode, title, message }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
            {/* Main Card */}
            <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-blue-100 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-blue-500 opacity-5" />
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-50 rounded-full opacity-50" />
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-blue-50 rounded-full opacity-50" />

                {/* Logo */}
                <div className="relative flex justify-center mb-8">
                    <Image
                        src="/DComalaLogo.png"
                        alt="Comala Logo"
                        width={180}
                        height={120}
                        priority
                        className="object-contain drop-shadow-md"
                    />
                </div>

                {/* Error Content */}
                <div className="relative space-y-6 text-center">
                    {/* Error code with animated gradient */}
                    <div className="relative">
                        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 animate-gradient">
                            {errorCode}
                        </h1>
                        <div className="absolute -inset-1 blur-lg bg-gradient-to-r from-blue-600/20 to-blue-400/20 -z-10" />
                    </div>

                    {/* Title and message */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                            {message}
                        </p>
                    </div>

                    {/* Action button */}
                    <Link href="/" className="block mt-8">
                        <button className="group w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg">
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="w-5 h-5 transition-transform duration-300 transform group-hover:-translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al Inicio
                            </span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-sm text-gray-600">
                © 2024 H. Ayuntamiento de Comala. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default ErrorLayout;