"use client";

export function ConfirmDeleteForm({ action, id, message, label = "Delete" }: { action: (formData: FormData) => void | Promise<void>; id: string; message: string; label?: string }) {
  return <form action={action} className="mt-4 border-t border-[#eceee7] pt-4" onSubmit={(event) => { if (!window.confirm(message)) event.preventDefault(); }}>
    <input type="hidden" name="id" value={id} />
    <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">{label}</button>
  </form>;
}
