import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;

        // Si el usuario está autenticado, redirigir según su rol
        if (token) {
            console.log("Token role:", token.role);
            // Redirigir ADMIN a /admin/dashboard
            if (token.role === "ADMIN") {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
            // Redirigir usuarios normales a /user/dashboard
            return NextResponse.redirect(new URL("/user/dashboard", req.url));
        }

        // Si no hay token, redirigir al login
        return NextResponse.redirect(new URL("/login", req.url));
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
        "/user/:path",
        "/admin/:path"
    ],
};