"use client";
import { Bell, Home, LogOut, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderAdmin() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navigationItems = [
        {
            name: "Inicio",
            path: "/admin/dashboard",
            icon: Home,
        },
        {
            name: "Crear Usuario",
            path: "/admin/users",
            icon: UserPlus,
        },
        {
            name: "Gestionar Usuarios",
            path: "/admin/manage-users",
            icon: Users,
        },
    ];

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Image
                            src="/DComalaLogo.png"
                            alt="D Comala Logo"
                            width={120}
                            height={80}
                            className="object-contain"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex space-x-1">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out mx-1
                                    ${isActive(item.path)
                                        ? "text-blue-600 bg-blue-50 shadow-sm transform scale-105"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                            >
                                <item.icon
                                    className={`mr-2 h-5 w-5 transition-colors duration-200
                                        ${isActive(item.path) ? "text-blue-600" : "text-gray-400"}`}
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                        </button>
                        {/* Profile */}
                        <div className="flex items-center space-x-3">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-700">Admin User</span>
                                <span className="text-xs text-gray-500">admin@comala.com</span>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}