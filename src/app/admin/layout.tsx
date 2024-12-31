// app/user/layout.tsx
import { protectUserRoute } from "@/lib/auth/route-protection";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await protectUserRoute();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
