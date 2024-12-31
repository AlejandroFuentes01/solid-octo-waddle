import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authCallbacks = {
    async jwt({ token, user }: { token: JWT; user: any }) {
        if (user) {
            token.role = user.role;
            token.username = user.username;
        }
        return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
        if (token) {
            session.user.role = token.role;
            session.user.username = token.username;
        }
        return session;
    },
};