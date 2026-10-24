import { randomBytes, createHash } from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import type { Role } from "@prisma/client";

const INVITATION_TTL_HOURS = 72;
type InvitationClient = Pick<Prisma.TransactionClient, "accountInvitation">;

export class InvalidInvitationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInvitationError";
  }
}

export class InvitationPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvitationPasswordError";
  }
}

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Creates an invitation and returns the raw, one-time token.
 * The raw token is NEVER stored — only its hash is. The caller is
 * responsible for delivering the raw token to the invitee (currently:
 * displaying the accept-invite URL in the admin UI, since no transactional
 * email provider is configured yet — see README "Not yet built").
 */
export async function createInvitation(
  params: {
    email: string;
    role: Role;
    createdById: string | null;
  },
  client: InvitationClient = prisma
) {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + INVITATION_TTL_HOURS * 60 * 60 * 1000);
  const email = params.email.toLowerCase().trim();

  await client.accountInvitation.updateMany({
    where: { email, role: params.role, acceptedAt: null },
    data: { expiresAt: new Date() }
  });

  await client.accountInvitation.create({
    data: {
      email,
      role: params.role,
      tokenHash,
      expiresAt,
      createdById: params.createdById
    }
  });

  return { rawToken, expiresAt };
}

export type InvitationLookupResult =
  | { valid: true; email: string; role: Role; invitationId: string }
  | { valid: false; reason: "not_found" | "expired" | "used" };

export async function lookupInvitation(rawToken: string): Promise<InvitationLookupResult> {
  const tokenHash = hashToken(rawToken);
  const invitation = await prisma.accountInvitation.findUnique({ where: { tokenHash } });

  if (!invitation) return { valid: false, reason: "not_found" };
  if (invitation.acceptedAt) return { valid: false, reason: "used" };
  if (invitation.expiresAt < new Date()) return { valid: false, reason: "expired" };

  return {
    valid: true,
    email: invitation.email,
    role: invitation.role,
    invitationId: invitation.id
  };
}

/**
 * Consumes a valid invitation, creating the User account with a
 * password the invitee chose themselves. Wrapped in a transaction so an
 * invitation can never be marked accepted without the User actually
 * being created (or vice versa).
 */
export async function acceptInvitation(params: {
  rawToken: string;
  name: string;
  password: string;
}) {
  const lookup = await lookupInvitation(params.rawToken);
  if (!lookup.valid) {
    throw new InvalidInvitationError(`Invitation invalid: ${lookup.reason}`);
  }

  const passwordHash = await hashPassword(params.password);

  return prisma.$transaction(async (tx) => {
    const consumed = await tx.accountInvitation.updateMany({
      where: {
        id: lookup.invitationId,
        acceptedAt: null,
        expiresAt: { gt: new Date() }
      },
      data: { acceptedAt: new Date() }
    });
    if (consumed.count !== 1) {
      throw new InvalidInvitationError("Invitation is no longer valid.");
    }

    if (lookup.role === "BLOGGER") {
      const application = await tx.blogApplication.findFirst({
        where: {
          status: "APPROVED",
          email: { equals: lookup.email, mode: "insensitive" }
        }
      });
      if (!application) {
        throw new InvalidInvitationError("Approved blogger application not found.");
      }

      if (params.password === application.schoolId) {
        throw new InvitationPasswordError(
          "A school ID cannot be used as a password."
        );
      }

      const existingUser = await tx.user.findUnique({
        where: { email: lookup.email },
        include: { bloggerProfile: true }
      });

      if (existingUser) {
        if (
          existingUser.role !== "BLOGGER" ||
          existingUser.bloggerProfile?.schoolId !== application.schoolId
        ) {
          throw new InvalidInvitationError(
            "Existing account does not match this blogger application."
          );
        }

        return tx.user.update({
          where: { id: existingUser.id },
          data: { passwordHash }
        });
      }

      return tx.user.create({
        data: {
          email: lookup.email,
          name: params.name,
          passwordHash,
          role: lookup.role,
          bloggerProfile: {
            create: {
              type: application.type,
              schoolId: application.schoolId,
              displayName: application.fullName,
              phone: application.phone,
              className: application.className,
              section: application.section,
              rollNumber: application.rollNumber,
              guardianName: application.guardianName,
              guardianRelationship: application.guardianRelationship,
              guardianPhone: application.guardianPhone,
              formTeacher: application.formTeacher,
              subject: application.subject
            }
          }
        }
      });
    }

    const user = await tx.user.create({
      data: {
        email: lookup.email,
        name: params.name,
        passwordHash,
        role: lookup.role
      }
    });

    return user;
  });
}
