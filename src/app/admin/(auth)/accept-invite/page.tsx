import type { Metadata } from "next";
import {
  lookupInvitation,
  type InvitationLookupResult
} from "@/lib/invitation";
import { AcceptInviteForm } from "./AcceptInviteForm";
import { acceptInviteAction } from "./actions";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = { referrer: "no-referrer" };

const ERROR_MESSAGES: Record<string, string> = {
  missing_fields: "Please fill in every field.",
  password_mismatch: "Passwords do not match.",
  password_too_short: "Password must be at least 10 characters.",
  password_too_long: "Password must be no longer than 100 characters.",
  school_id_password: "Your school ID cannot be used as your password.",
  invalid_invitation: "This invitation is invalid, expired, or already used."
};

export default async function AcceptInvitePage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token: rawToken, error } = await searchParams;
  const token = rawToken ?? "";
  const errorMessage = error ? ERROR_MESSAGES[error] : null;

  const lookup: InvitationLookupResult = token
    ? await lookupInvitation(token)
    : { valid: false, reason: "not_found" };

  if (!lookup.valid) {
    const reasonText =
      lookup.reason === "expired"
        ? "This invitation link has expired."
        : lookup.reason === "used"
          ? "This invitation has already been used."
          : "This invitation link is invalid.";
    return (
      <AuthShell
        eyebrow="Account invitation"
        headline={<>Invitation<br /><span className="text-[#e4d49a]">unavailable.</span></>}
        blurb="Invitation links are single-use and expire for your security."
        title="We couldn’t open this invitation"
        subtitle={reasonText}
      >
        <p className="text-base leading-7 text-[#303831]">
          Ask an existing administrator to send you a new invitation.
        </p>
      </AuthShell>
    );
  }

  const roleLabel = lookup.role === "ADMIN" ? "administrator" : lookup.role === "BLOGGER" ? "blogger" : "teacher";
  return (
    <AuthShell
      eyebrow="Account invitation"
      headline={<>Welcome to<br />the <span className="text-[#e4d49a]">team.</span></>}
      blurb="Choose a password to activate your KCMSC account."
      points={["Passwords must be at least 10 characters", "Your school ID cannot be your password"]}
      title="Set Up Your Account"
      subtitle={`Creating a ${roleLabel} account for ${lookup.email}`}
    >
      {errorMessage ? (
        <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{errorMessage}</p>
      ) : null}
      <AcceptInviteForm token={token} action={acceptInviteAction} />
    </AuthShell>
  );
}
