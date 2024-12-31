// app/user/layout.tsx
import { protectAdminRoute } from "@/lib/auth/route-protection";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await protectAdminRoute();

    return (
        <div>
            <main>
                {children}
            </main>
        </div>
    );
}
