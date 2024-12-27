// app/api/auth/[...nextauth]/route.ts
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../../util/auth";

const prisma = new PrismaClient();

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.username || !credentials?.password) {
                        throw new Error("Por favor, ingresa usuario y contraseña");
                    }

                    // Buscar usuario y validar credenciales
                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username },
                        select: {
                            id: true,
                            username: true,
                            password: true,
                            email: true,
                            fullName: true,
                            role: true,
                            area: true,
                        },
                    });

                    if (!user) {
                        throw new Error("Usuario y/o contraseña incorrecta");
                    }

                    // Verificar contraseña
                    const isValid = await verifyPassword(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Usuario y/o contraseña incorrecta");
                    }

                    // Devolver datos del usuario sin la contraseña
                    return {
                        id: user.id.toString(),
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        area: user.area,
                        name: user.fullName,
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Error en la autenticación");
                } finally {
                    await prisma.$disconnect();
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role;
                token.area = user.area;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id,
                    username: token.username,
                    role: token.role,
                    area: token.area,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 horas
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };