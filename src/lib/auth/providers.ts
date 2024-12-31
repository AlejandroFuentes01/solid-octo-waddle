import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../prisma";

export const credentialsProvider = CredentialsProvider({
    name: "Credentials",
    credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
            throw new Error("Credenciales incompletas");
        }

        const user = await prisma.user.findUnique({
            where: { username: credentials.username },
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
            throw new Error("Contraseña incorrecta");
        }

        return {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
            name: user.fullName,
        };
    },
});