"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface StatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (status: string) => void;
    currentStatus: string;
}

const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROCESS", label: "In Process" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CANCELLED", label: "Cancelled" },
];

export default function StatusChangeModal({
    isOpen,
    onClose,
    onStatusChange,
    currentStatus,
}: StatusChangeModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Change Ticket Status
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-500">
                        Current status: <span className="font-medium">{currentStatus}</span>
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onStatusChange(option.value);
                                    onClose();
                                }}
                                disabled={option.value === currentStatus}
                                className={`p-3 text-sm font-medium rounded-lg transition-all
                    ${option.value === currentStatus
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white hover:bg-blue-50 text-gray-900 border border-gray-200 hover:border-gray-300"
                                    }
                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}