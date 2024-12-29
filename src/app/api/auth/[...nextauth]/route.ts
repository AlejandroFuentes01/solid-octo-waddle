// app/api/auth/[...nextauth]/route.ts
import { PrismaClient } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../../util/auth";

/**
 * Este archivo define la configuración de autenticación para Next.js utilizando NextAuth.
 *
 * La API maneja la autenticación de usuarios mediante credenciales (usuario y contraseña).
 *
 * Funcionalidad:
 * - Utiliza Prisma como ORM para interactuar con la base de datos.
 * - Define un proveedor de credenciales para la autenticación.
 * - Verifica las credenciales del usuario y autentica al usuario si las credenciales son correctas.
 * - Devuelve información del usuario autenticado, incluyendo su ID, nombre de usuario, correo electrónico, nombre completo, rol y área.
 *
 * Proceso de Autenticación:
 * - El usuario ingresa su nombre de usuario y contraseña.
 * - La API busca al usuario en la base de datos utilizando Prisma.
 * - Si el usuario es encontrado, la contraseña es verificada utilizando la función `verifyPassword`.
 * - Si las credenciales son correctas, se devuelve la información del usuario.
 * - Si las credenciales son incorrectas o faltan, se lanza un error.
 */

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

