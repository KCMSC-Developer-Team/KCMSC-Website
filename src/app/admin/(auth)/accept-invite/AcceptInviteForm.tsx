"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="kc-btn kc-btn-primary w-full"
    >
      {pending ? "Creating account…" : "Set password & create account"}
    </button>
  );
}

export function AcceptInviteForm({
  token,
  action
}: {
  token: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#414741]">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          className="kc-input mt-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#414741]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={10}
          className="kc-input mt-2"
        />
        <p className="mt-2 text-sm text-[#69716b]">At least 10 characters.</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#414741]">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={10}
          className="kc-input mt-2"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
