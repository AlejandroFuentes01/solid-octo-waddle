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
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="h-20 flex items-center justify-between">
                    {/* Left Section - Logo */}
                    <div className="flex-shrink-0 relative w-[130px] h-[80px]">
                        <Image
                            src="/DComalaLogo.png"
                            alt="D Comala Logo"
                            fill
                            sizes="130px"
                            className="object-contain transition-transform duration-300 hover:scale-105"
                            priority
                        />
                    </div>

                    {/* Center Section - Navigation */}
                    <nav className="hidden lg:flex flex-1 justify-center max-w-2xl mx-12">
                        <div className="flex space-x-8">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`
                                        group flex items-center px-4 py-2 rounded-lg text-sm font-medium
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
                                    <item.icon className={`w-4 h-4 mr-2 transition-colors duration-300 ${isActive(item.path)
                                        ? "text-blue-600"
                                        : "text-gray-400 group-hover:text-blue-600"
                                        }`} />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Right Section - User Info & Actions */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {/* Notifications */}
                        <div className="flex items-center">
                            <button className="relative p-2 rounded-lg hover:bg-blue-50 transition-all duration-300 group">
                                <Bell className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                            </button>
                        </div>

                        <div className="h-8 w-px bg-gray-200" aria-hidden="true" />

                        {/* User Info and Logout */}
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-800 leading-tight">Admin User</span>
                                <span className="text-xs text-gray-500">admin@comala.com</span>
                            </div>
                            <button className="p-2 rounded-lg hover:bg-blue-50 transition-all duration-300 group">
                                <LogOut className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                        <Menu className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden py-2 space-y-1 bg-white rounded-lg shadow-lg animate-fadeIn">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`
                                    flex items-center px-4 py-2.5 text-sm font-medium
                                    transition-all duration-300 ease-in-out
                                    ${isActive(item.path)
                                        ? "text-blue-700 bg-blue-50"
                                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                    }
                                `}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <item.icon className={`mr-3 h-4 w-4 ${isActive(item.path) ? "text-blue-600" : "text-gray-400"
                                    }`} />
                                {item.name}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                            <div className="px-4 py-2 mx-2">
                                <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Admin User</p>
                                        <p className="text-xs text-gray-500">admin@comala.com</p>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-blue-50 transition-all duration-300">
                                        <LogOut className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">
                                <Bell className="mr-3 h-4 w-4 text-gray-400" />
                                Notificaciones
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}