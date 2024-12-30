"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg`}>
            <span>{message}</span>
            <button
                onClick={onClose}
                className="ml-3 hover:text-gray-200"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}