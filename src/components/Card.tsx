import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-lg ring-1 ring-gray-100/5 backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${className}`}>
            {children}
        </div>
    );
}