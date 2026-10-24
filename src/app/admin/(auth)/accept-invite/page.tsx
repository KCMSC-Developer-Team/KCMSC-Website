import type { Metadata } from "next";
import {
  lookupInvitation,
  type InvitationLookupResult
} from "@/lib/invitation";
import { AcceptInviteForm } from "./AcceptInviteForm";
import { acceptInviteAction } from "./actions";

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
  searchParams: { token?: string; error?: string };
}) {
  const token = searchParams.token ?? "";
  const errorMessage = searchParams.error ? ERROR_MESSAGES[searchParams.error] : null;

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
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-ink">{reasonText}</p>
        <p className="mt-2 text-sm text-ink-muted">
          Ask an existing administrator to send you a new invitation.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-2 text-center text-xl font-medium text-ink">Set Up Your Account</h1>
      <p className="mb-6 text-center text-sm text-ink-muted">
        Creating a {lookup.role === "ADMIN" ? "administrator" : lookup.role === "BLOGGER" ? "blogger" : "admission officer"} account for{" "}
        <span className="font-medium text-ink">{lookup.email}</span>
      </p>
      {errorMessage ? <p className="mb-4 text-center text-sm text-brick">{errorMessage}</p> : null}
      <AcceptInviteForm token={token} action={acceptInviteAction} />
    </>
  );
}
