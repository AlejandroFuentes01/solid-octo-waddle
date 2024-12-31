// app/user/layout.tsx
import { protectUserRoute } from "@/lib/auth/route-protection";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await protectUserRoute();

    return (
        <div>
            <main>
                {children}
            </main>
        </div>
    );
}
