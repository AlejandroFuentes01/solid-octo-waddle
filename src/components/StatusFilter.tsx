import { Filter } from 'lucide-react';

interface StatusFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
    return (
        <div className="relative group flex items-center space-x-2">
            <Filter className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En Proceso</option>
                <option value="finalizado">Finalizado</option>
            </select>
        </div>
    );
}