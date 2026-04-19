import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 }, // 7 days
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
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

        if (!user || !user.passwordHash) {
          console.info("[AUDIT]", JSON.stringify({
            timestamp: new Date().toISOString(),
            action: "LOGIN_FAILED",
            email,
            reason: user ? "no_password_set" : "user_not_found",
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
    async signIn({ user, account }) {
      // For Google OAuth: handle first-time user setup
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // New Google user — will be created by adapter, but we need to set defaults
          // The adapter creates the User, so we update it post-creation in the jwt callback
          return true;
        }

        // Existing user linking their Google account
        return true;
      }
      return true;
    },

    async jwt({ token, user, account, trigger }) {
      // On initial sign-in (both Credentials and OAuth)
      if (user) {
        token.id = user.id!;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role ?? "USER";
        token.userType = (user as any).userType ?? "PROFESSIONAL";
      }

      // For Google OAuth: ensure userType is populated from DB
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, userType: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.userType = dbUser.userType;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        (session.user as any).userType = token.userType;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      // When a new user is created via OAuth, set up their profile
      if (user.email && user.id) {
        const hasProfile = await prisma.profile.findUnique({
          where: { userId: user.id },
        });

        if (!hasProfile) {
          const displayName = user.name || user.email.split("@")[0];
          const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + user.id.slice(-4);

          await prisma.profile.create({
            data: {
              userId: user.id,
              displayName,
              slug,
              city: "",
              state: "",
              role: "THERAPIST",
            },
          });

          // Create free subscription
          await prisma.subscription.create({
            data: {
              userId: user.id,
              plan: "FREE",
              status: "ACTIVE",
              startDate: new Date(),
            },
          });
        }
      }
    },
  },
});
