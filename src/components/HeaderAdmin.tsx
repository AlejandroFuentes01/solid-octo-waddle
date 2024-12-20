"use client";
import { Bell, Home, LogOut, Menu, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function HeaderAdmin() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navigationItems = [
        { name: "Inicio", path: "/admin/dashboard", icon: Home },
        { name: "Crear Usuario", path: "/admin/users", icon: UserPlus },
        { name: "Gestionar Usuarios", path: "/admin/manage-users", icon: Users },
    ];

    return (
        <header className="bg-gradient-to-r from-white to-blue-50 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
                        <Image
                            src="/DComalaLogo.png"
                            alt="D Comala Logo"
                            width={130}
                            height={80}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <nav className="hidden lg:flex items-center justify-center flex-1 px-12">
                        <div className="flex gap-6">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`
                                        group flex items-center px-5 py-2.5 rounded-lg text-sm font-medium
                                        transition-all duration-300 ease-in-out relative
                                        ${isActive(item.path)
                                            ? "text-blue-700 bg-blue-50/80"
                                            : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
                                        }
                                        ${isActive(item.path) 
                                            ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                                            : "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
                                        }
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 mr-2 transition-colors duration-300 ${
                                        isActive(item.path) 
                                            ? "text-blue-600" 
                                            : "text-gray-400 group-hover:text-blue-600"
                                    }`} />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    <div className="hidden lg:flex items-center space-x-8">
                        <button className="relative p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 group">
                            <Bell className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                        </button>

                        <div className="h-8 w-px bg-gray-200/80"></div>

                        <div className="flex items-center gap-5">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-800">Admin User</span>
                                <span className="text-xs text-gray-500">admin@comala.com</span>
                            </div>
                            <button className="p-2.5 rounded-xl hover:bg-blue-50 transition-all duration-300 group">
                                <LogOut className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2.5 rounded-xl hover:bg-blue-50 transition-all duration-300"
                    >
                        <Menu className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden py-3 space-y-1.5 bg-white rounded-b-xl shadow-lg animate-fadeIn">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`
                                    flex items-center px-4 py-3 text-base font-medium
                                    transition-all duration-300 ease-in-out relative
                                    ${isActive(item.path)
                                        ? "text-blue-700 bg-blue-50/80"
                                        : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
                                    }
                                `}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${
                                    isActive(item.path) ? "text-blue-600" : "text-gray-400"
                                }`} />
                                {item.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 mt-3 pt-3">
                            <div className="px-4 py-2.5 bg-gray-50/50 rounded-lg mx-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Admin User</p>
                                        <p className="text-xs text-gray-500">admin@comala.com</p>
                                    </div>
                                    <button className="p-2.5 rounded-xl hover:bg-blue-50 transition-all duration-300">
                                        <LogOut className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <button className="flex items-center w-full px-4 py-3 mt-2 text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">
                                <Bell className="mr-3 h-5 w-5 text-gray-400" />
                                Notificaciones
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}