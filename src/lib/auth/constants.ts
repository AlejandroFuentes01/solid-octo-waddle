export const AUTH_ERRORS = {
    INVALID_CREDENTIALS: "Usuario y/o contraseña incorrecta",
    USER_NOT_FOUND: "Usuario no encontrado",
    INCOMPLETE_CREDENTIALS: "Por favor, ingresa usuario y contraseña",
    UNAUTHORIZED: "No tienes permisos para acceder a esta sección",
    SESSION_REQUIRED: "Debes iniciar sesión para acceder",
} as const;

export const AUTH_ROUTES = {
    LOGIN: "/login",
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        MANAGE_USERS: "/admin/manage-users",
        USERS: "/admin/users"
    },
    USER: {
        DASHBOARD: "/user/dashboard",
        CREATE_TICKET: "/user/create-ticket"
    }
} as const;