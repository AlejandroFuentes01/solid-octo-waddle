import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        console.log('Path:', path);
        console.log('Token:', JSON.stringify(token, null, 2));
        console.log('Role:', token?.role);

        if (!token) {
            console.log('No token found, redirecting to login');
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Si estamos en la ruta principal o /dashboard
        if (path === "/" || path === "/dashboard") {
            const redirectPath = token.role === "ADMIN"
                ? "/admin/dashboard"
                : "/user/dashboard";

            console.log('Redirecting to:', redirectPath);
            return NextResponse.redirect(new URL(redirectPath, req.url));
        }

        // Protección de rutas admin
        if (path.startsWith("/admin")) {
            if (token.role === "ADMIN") {
                console.log('Admin access granted');
                return NextResponse.next();
            } else {
                console.log('Admin access denied, redirecting to user dashboard');
                return NextResponse.redirect(new URL("/user/dashboard", req.url));
            }
        }

        // Protección de rutas usuario
        if (path.startsWith("/user")) {
            if (token.role === "NORMAL") {
                console.log('User access granted');
                return NextResponse.next();
            } else {
                console.log('User access denied, redirecting to admin dashboard');
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
        }

        // Default: allow access
        return NextResponse.next();
    }
);

// Especificar las rutas que el middleware debe proteger
export const config = {
    matcher: [
        "/",
        "/dashboard",
        "/admin/:path*",
        "/user/:path*"
    ]
};