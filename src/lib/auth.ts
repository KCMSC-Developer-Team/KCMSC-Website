export const ROLES = {
  ADMIN: "ADMIN",
  BLOGGER: "BLOGGER",
  TEACHER: "TEACHER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export function isAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === ROLES.ADMIN;
}

export function isBlogger(user: SessionUser | null | undefined): boolean {
  return user?.role === ROLES.BLOGGER;
}

export function isTeacher(user: SessionUser | null | undefined): boolean {
  return user?.role === ROLES.TEACHER;
}

export function canDeleteAccount(
  sessionUser: SessionUser,
  targetUserId: string,
): boolean {
  return sessionUser.role === ROLES.ADMIN && sessionUser.id === targetUserId;
}
