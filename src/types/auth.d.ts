import { Role } from "@prisma/client";

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    role: Role;
    area: string;
    name: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthError {
    message: string;
    code?: string;
}