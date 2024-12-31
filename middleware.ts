import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Si no hay token, redirigir al login
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Protección de rutas de admin
        if (path.startsWith("/admin") && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/forbidden", req.url));
        }

        // Protección de rutas de usuario normal
        if (path.startsWith("/user") && token.role !== "NORMAL") {
            return NextResponse.redirect(new URL("/forbidden", req.url));
        }

        // Redirección de la ruta /dashboard según el rol
        if (path === "/dashboard") {
            const dashboardUrl = token.role === "ADMIN"
                ? "/admin/dashboard"
                : "/user/dashboard";
            return NextResponse.redirect(new URL(dashboardUrl, req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/dashboard",
        "/user/:path*",
        "/admin/:path*"
    ],
};
