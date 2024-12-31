import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./config";
import { AUTH_ROUTES } from "./constants";

export async function protectRoute(allowedRoles: ("ADMIN" | "NORMAL")[]) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect(AUTH_ROUTES.LOGIN);
    }

    if (!allowedRoles.includes(session.user.role)) {
        const redirectPath = session.user.role === "ADMIN"
            ? AUTH_ROUTES.ADMIN.DASHBOARD
            : AUTH_ROUTES.USER.DASHBOARD;
        redirect(redirectPath);
    }

    return session.user;
}

export async function protectAdminRoute() {
    return protectRoute(["ADMIN"]);
}

export async function protectUserRoute() {
    return protectRoute(["NORMAL"]);
}