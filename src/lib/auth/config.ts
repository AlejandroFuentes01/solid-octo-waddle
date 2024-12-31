import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "../prisma";
import { authCallbacks } from "./callbacks";
import { credentialsProvider } from "./providers";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [credentialsProvider],
    callbacks: authCallbacks,
};