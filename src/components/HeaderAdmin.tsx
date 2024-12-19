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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Left Section: Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Image
                            src="/DComalaLogo.png"
                            alt="D Comala Logo"
                            width={120}
                            height={80}
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Center Section: Navigation */}
                    <nav className="hidden lg:flex flex-1 justify-center mx-8">
                        <div className="flex space-x-2">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                                        ${isActive(item.path)
                                            ? "text-blue-600 bg-blue-50 shadow-sm transform scale-105"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/80"
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-2 h-5 w-5 transition-colors duration-200
                                            ${isActive(item.path) ? "text-blue-600" : "text-gray-400"}`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Right Section: Notifications & Profile */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {/* Notifications */}
                        <div className="relative group">
                            <button className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white" />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gray-200"></div>

                        {/* Profile */}
                        <div className="flex items-center space-x-3 pr-2">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-700">Admin User</span>
                                <span className="text-xs text-gray-500">admin@comala.com</span>
                            </div>
                            <button className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200
                                        ${isActive(item.path)
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5
                                            ${isActive(item.path) ? "text-blue-600" : "text-gray-400"}`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                            
                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="px-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-base font-medium text-gray-800">Admin User</div>
                                            <div className="text-sm text-gray-500">admin@comala.com</div>
                                        </div>
                                        <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                                            <LogOut className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <button className="flex items-center w-full px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                                    <Bell className="mr-3 h-5 w-5 text-gray-400" />
                                    Notificaciones
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}