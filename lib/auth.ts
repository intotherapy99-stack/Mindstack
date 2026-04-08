import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 }, // 7 days (reduced from 30)
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true, clientProfile: true },
        });

        if (!user) {
          console.info("[AUDIT]", JSON.stringify({
            timestamp: new Date().toISOString(),
            action: "LOGIN_FAILED",
            email,
            reason: "user_not_found",
          }));
          return null;
        }

        // Account lockout check — 5 failed attempts = 15 min lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          console.info("[AUDIT]", JSON.stringify({
            timestamp: new Date().toISOString(),
            action: "LOGIN_FAILED",
            userId: user.id,
            email,
            reason: "account_locked",
            lockedUntil: user.lockedUntil.toISOString(),
          }));
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordMatch) {
          const attempts = user.failedLoginAttempts + 1;
          const lockData: any = { failedLoginAttempts: attempts };
          if (attempts >= 5) {
            lockData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
          }
          await prisma.user.update({ where: { id: user.id }, data: lockData });

          console.info("[AUDIT]", JSON.stringify({
            timestamp: new Date().toISOString(),
            action: "LOGIN_FAILED",
            userId: user.id,
            email,
            reason: "invalid_password",
            failedAttempts: attempts,
            locked: attempts >= 5,
          }));
          return null;
        }

        // Reset failed attempts on successful login
        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockedUntil: null },
          });
        }

        console.info("[AUDIT]", JSON.stringify({
          timestamp: new Date().toISOString(),
          action: "LOGIN",
          userId: user.id,
          email,
        }));

        const displayName =
          user.userType === "CLIENT"
            ? user.clientProfile?.displayName ?? user.email
            : user.profile?.displayName ?? user.email;

        return {
          id: user.id,
          email: user.email,
          name: displayName,
          role: user.role,
          userType: user.userType,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as any).role;
        token.userType = (user as any).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).userType = token.userType;
      }
      return session;
    },
  },
});
