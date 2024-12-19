import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
    return (
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            <input
                type="text"
                placeholder={placeholder || "Buscar..."}
                value={value}
                onChange={(e) => onChange(e.target.value.toLowerCase())}
                className="pl-10 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
        </div>
    );
}