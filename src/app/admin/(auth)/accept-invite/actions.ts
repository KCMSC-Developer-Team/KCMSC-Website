"use server";

import { redirect } from "next/navigation";
import {
  acceptInvitation,
  InvitationPasswordError,
  InvalidInvitationError
} from "@/lib/invitation";

export async function acceptInviteAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token || !name || !password) {
    redirect(`/admin/accept-invite?token=${encodeURIComponent(token)}&error=missing_fields`);
  }
  if (password !== confirmPassword) {
    redirect(`/admin/accept-invite?token=${encodeURIComponent(token)}&error=password_mismatch`);
  }
  if (password.length < 10) {
    redirect(`/admin/accept-invite?token=${encodeURIComponent(token)}&error=password_too_short`);
  }
  if (password.length > 100) {
    redirect(`/admin/accept-invite?token=${encodeURIComponent(token)}&error=password_too_long`);
  }

  try {
    await acceptInvitation({ rawToken: token, name, password });
  } catch (error) {
    if (error instanceof InvitationPasswordError) {
      redirect(
        `/admin/accept-invite?token=${encodeURIComponent(token)}&error=school_id_password`
      );
    }
    if (error instanceof InvalidInvitationError) {
      redirect(`/admin/accept-invite?token=${encodeURIComponent(token)}&error=invalid_invitation`);
    }
    throw error;
  }

  redirect("/admin/login?setup=complete");
}
