import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

/**
 * Phase 3 scope decisions:
 *  - JWT session strategy, not database sessions — there's no need for
 *    server-revocable sessions yet, and it keeps the Prisma schema free
 *    of a Session table. Revisit if "force logout everywhere" becomes a
 *    real requirement later.
 *  - A tiny in-memory rate limiter guards login attempts per email
 *    (see loginAttempts below). This is intentionally simple — a single
 *    serverless instance's memory, reset on redeploy — and should be
 *    replaced with a shared store (e.g. Upstash/Redis) before this goes
 *    to production traffic. Flagged here rather than silently shipped
 *    as if it were production-grade.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const loginAttempts = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(email: string): boolean {
  const entry = loginAttempts.get(email);
  if (!entry) return false;
  if (Date.now() - entry.windowStart > WINDOW_MS) {
    loginAttempts.delete(email);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(email: string) {
  const entry = loginAttempts.get(email);
  if (!entry || Date.now() - entry.windowStart > WINDOW_MS) {
    loginAttempts.set(email, { count: 1, windowStart: Date.now() });
  } else {
    entry.count += 1;
  }
}

function clearAttempts(email: string) {
  loginAttempts.delete(email);
}

export const authOptions: AuthOptions = {
  // Keep NextAuth and middleware on the exact same signing secret.
  // The project uses AUTH_SECRET consistently across the stack.
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toLowerCase().trim();

        if (isRateLimited(email)) {
          throw new Error("TooManyAttempts");
        }

        const user = await prisma.user.findFirst({
          where: { OR: [{ email }, { bloggerProfile: { is: { schoolId: email } } }, { teacherProfile: { is: { staffId: email } } }] },
          include: { bloggerProfile: true, teacherProfile: true },
        });
        if (user?.role === "BLOGGER" && !user.bloggerProfile) return null;
        if (user?.role === "TEACHER" && (!user.teacherProfile || !user.teacherProfile.isActive)) return null;
        if (!user) {
          recordFailedAttempt(email);
          return null;
        }

        const valid = await verifyPassword(credentials.password, user.passwordHash);
        if (!valid) {
          recordFailedAttempt(email);
          return null;
        }

        clearAttempts(email);
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = (token.name as string) ?? "";
        session.user.role = token.role as "ADMIN" | "ADMISSION_OFFICER" | "BLOGGER" | "TEACHER";
      }
      return session;
    }
  }
};
