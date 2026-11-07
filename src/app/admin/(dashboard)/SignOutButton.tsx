"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      type="button"
      className="rounded-lg px-3 py-2 text-sm font-medium text-[#124c36] hover:bg-[#efeee7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b45] focus-visible:ring-offset-2"
    >
      Sign out
    </button>
  );
}
