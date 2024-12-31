// app/user/dashboard/page.tsx
import { protectUserRoute } from "@/lib/auth/route-protection";

export default async function UserDashboard() {
    const user = await protectUserRoute();

    return (
        <div>
            <h1>Panel de Usuario</h1>
            <p>Bienvenido, {user.name}</p>
        </div>
    );
}