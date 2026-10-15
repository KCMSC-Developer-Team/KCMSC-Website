import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    // email/name are always present for our users (they come from the
    // User table), so narrow NextAuth's default `string | null | undefined`.
    user: {
      id: string;
      email: string;
      name: string;
      role: "ADMIN" | "ADMISSION_OFFICER" | "BLOGGER";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "ADMIN" | "ADMISSION_OFFICER" | "BLOGGER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "ADMISSION_OFFICER" | "BLOGGER";
  }
}
