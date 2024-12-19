"use client";

import Card from '@/components/Card';
import CreateUserForm from '@/components/CreateUserForm';
import Footer from '@/components/Footer';
import HeaderAdmin from '@/components/HeaderAdmin';
import { UserPlus } from 'lucide-react';

export default function CreateUserPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <HeaderAdmin />

            <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Card className="max-w-2xl mx-auto overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center justify-center space-x-3 mb-8">
                            <UserPlus className="h-8 w-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">
                                Crear Nuevo Usuario
                            </h1>
                        </div>

                        <CreateUserForm />
                    </div>
                </Card>
            </main>

            <Footer />
        </div>
    );
}