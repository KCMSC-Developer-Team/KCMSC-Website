"use client";
import { signOut } from "next-auth/react";
import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

type T = {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  wing: string;
  subjects: string[];
  photoUrl: string | null;
  highestDegree: string | null;
  university: string | null;
  qualifications: string | null;
  quote: string | null;
  biography: string | null;
  studentMessage: string | null;
  mustChangePassword: boolean;
  isPublished: boolean;
};
const input =
  "mt-2 w-full min-w-0 rounded-xl border border-[#cbded1] bg-white px-4 py-3 text-sm text-[#183c2b] placeholder:text-[#8a9b90] outline-none transition focus:border-[#16734a] focus:ring-4 focus:ring-[#16734a]/10";
const label = "block text-sm font-semibold text-[#244b36]";
function Field({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={label}>
      {title}
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs font-normal leading-5 text-[#718176]">
          {hint}
        </span>
      )}
    </label>
  );
}
export default function TeacherDashboard({ teacher }: { teacher: T }) {
  const [t, setT] = useState(teacher);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [dragging, setDragging] = useState(false);
  const completed = [
    t.photoUrl,
    t.highestDegree,
    t.university,
    t.qualifications,
    t.quote,
    t.biography,
    t.studentMessage,
  ].filter((v) => String(v || "").trim()).length;
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 10) {
      setError("Use at least 10 characters for your new password.");
      return;
    }
    if (password !== confirm) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/teacher/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Password change failed");
        return;
      }
      setT((x) => ({ ...x, mustChangePassword: false }));
      setPassword("");
      setConfirm("");
      setMessage("Your password has been updated successfully.");
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const onCropComplete = useCallback(
    (_area: Area, pixels: Area) => setCroppedAreaPixels(pixels),
    [],
  );
  function choosePhoto(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("The image must be smaller than 8 MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(String(reader.result));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }
  async function confirmPhotoCrop() {
    if (!selectedImage || !croppedAreaPixels) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const image = new Image();
      image.src = selectedImage;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not read this image."));
      });
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 640;
      const ctx = canvas.getContext("2d");
      if (!ctx)
        throw new Error("Image editing is not supported in this browser.");
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        640,
        640,
      );
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Could not crop image."))),
          "image/jpeg",
          0.88,
        ),
      );
      const body = new FormData();
      body.append("photo", blob, "teacher-profile.jpg");
      const response = await fetch("/api/teacher/photo", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Photo upload failed.");
      setT((x) => ({ ...x, photoUrl: data.photoUrl }));
      setSelectedImage(null);
      setMessage(
        "Profile photo uploaded. Remember to save your profile changes.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload the photo.");
    } finally {
      setBusy(false);
    }
  }
  async function removePhoto() {
    if (!t.photoUrl) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/teacher/photo", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not remove photo.");
      setT((x) => ({ ...x, photoUrl: null }));
      setMessage("Profile photo removed.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove photo.");
    } finally {
      setBusy(false);
    }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const r = await fetch("/api/teacher/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoUrl: t.photoUrl,
          highestDegree: t.highestDegree,
          university: t.university,
          qualifications: t.qualifications,
          quote: t.quote,
          biography: t.biography,
          studentMessage: t.studentMessage,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "Profile could not be saved");
        return;
      }
      setMessage(
        "Profile saved. Public changes appear when the school publishes your profile.",
      );
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-[#f1f6f0] text-[#183c2b]">
      <header className="sticky top-0 z-20 border-b border-[#d4e4d7] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#12643f] text-lg font-bold text-white shadow-sm">
              K
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#16734a]">
                KCMSC · Teacher portal
              </p>
              <p className="truncate text-base font-bold text-[#153f2a] sm:text-lg">
                Teacher workspace
              </p>
            </div>
          </div>
          <button
            onClick={() => void signOut({ callbackUrl: "/teacher/login" })}
            className="shrink-0 rounded-xl border border-[#cbded1] bg-white px-3 py-2.5 text-xs font-semibold text-[#24543a] transition hover:bg-[#edf5ef] sm:px-4 sm:text-sm"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-[#105b39] p-5 text-white shadow-lg shadow-[#174b2e]/10 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-[#8bbd75]/10" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/25 bg-white/10 text-2xl font-bold text-white">
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  t.name
                    .split(/\s+/)
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#c4e4ce]">
                  Welcome to your workspace
                </p>
                <h1 className="mt-1 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                  {t.name}
                </h1>
                <p className="mt-1 text-sm text-[#d4e9da]">
                  {t.designation}{" "}
                  <span className="px-1.5 text-white/50">·</span> {t.wing}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15">
                Employee ID: {t.staffId}
              </span>
              <span
                className={`rounded-full px-3 py-2 ${t.isPublished ? "bg-[#d7f1df] text-[#145b38]" : "bg-[#f7e8b9] text-[#76520c]"}`}
              >
                {t.isPublished
                  ? "Public profile published"
                  : "Profile not yet published"}
              </span>
            </div>
          </div>
          <p className="relative mt-5 max-w-2xl text-sm leading-6 text-[#d8eadc]">
            Keep your professional profile up to date so students and families
            can learn about your academic background and teaching philosophy.
          </p>
        </section>
        {t.mustChangePassword && (
          <form
            onSubmit={changePassword}
            className="mt-5 overflow-hidden rounded-2xl border border-[#e7d39a] bg-white shadow-sm"
          >
            <div className="flex items-start gap-3 border-b border-[#f0e5c5] bg-[#fff9e8] px-5 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3e5b8] text-[#77520d]">
                !
              </span>
              <div>
                <h2 className="font-bold text-[#5d4512]">
                  Secure your account first
                </h2>
                <p className="mt-1 text-sm leading-5 text-[#806d3b]">
                  Your temporary password must be changed before you can edit
                  your profile.
                </p>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field title="New password">
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={input}
                  placeholder="At least 10 characters"
                />
              </Field>
              <Field title="Confirm new password">
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={input}
                  placeholder="Enter it again"
                />
              </Field>
            </div>
            {error && <p className="mx-5 text-sm text-red-700">{error}</p>}
            <div className="px-5 pb-5">
              <button
                disabled={busy}
                className="w-full rounded-xl bg-[#12643f] px-5 py-3 font-semibold text-white transition hover:bg-[#0d4d30] disabled:opacity-60 sm:w-auto"
              >
                {busy ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        )}
        {!t.mustChangePassword && (
          <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <form
              onSubmit={save}
              className="min-w-0 overflow-hidden rounded-2xl border border-[#d4e4d7] bg-white shadow-sm"
            >
              <div className="border-b border-[#e0ebe2] px-5 py-5 sm:px-7">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#16734a]">
                  Your information
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#153f2a] sm:text-2xl">
                  Edit your public profile
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#63786a]">
                  You control the professional details below. Your official
                  staff information is managed by school administration.
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8f0e9]">
                  <div
                    className="h-full rounded-full bg-[#218653] transition-all"
                    style={{ width: `${Math.round((completed / 7) * 100)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-[#63786a]">
                  {completed} of 7 profile sections filled in
                </p>
              </div>
              {message && (
                <div
                  role="status"
                  className="mx-5 mt-5 flex gap-2 rounded-xl border border-[#b9dfc5] bg-[#eaf7ed] p-3.5 text-sm text-[#17613b] sm:mx-7"
                >
                  <span className="font-bold">✓</span>
                  <span>{message}</span>
                </div>
              )}
              {error && (
                <div
                  role="alert"
                  className="mx-5 mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 sm:mx-7"
                >
                  {error}
                </div>
              )}
              <div className="space-y-7 p-5 sm:p-7">
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f3e8] text-sm font-bold text-[#12643f]">
                      01
                    </span>
                    <div>
                      <h3 className="font-bold text-[#1b4930]">
                        Academic background
                      </h3>
                      <p className="text-xs text-[#718176]">
                        Your qualifications and education
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <div className="mb-2 text-sm font-semibold text-[#244b36]">
                        Profile photo
                      </div>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          choosePhoto(e.dataTransfer.files?.[0]);
                        }}
                        className={`rounded-2xl border-2 border-dashed p-4 transition sm:p-5 ${dragging ? "border-[#12643f] bg-[#e6f3e8]" : "border-[#b9d5c1] bg-[#f7fbf7]"}`}
                      >
                        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d4e4d7] bg-[#e6f3e8] text-xl font-bold text-[#12643f]">
                            {t.photoUrl ? (
                              <img
                                src={t.photoUrl}
                                alt="Current profile"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              t.name
                                .split(/\s+/)
                                .map((x) => x[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#19482f]">
                              Drag and drop your photo here
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#718176]">
                              JPG, PNG or WebP · Up to 8 MB. You can crop, zoom
                              and reposition before uploading.
                            </p>
                            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                              <label className="cursor-pointer rounded-xl bg-[#12643f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d4d30]">
                                Choose photo
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="sr-only"
                                  onChange={(e) => {
                                    choosePhoto(e.target.files?.[0]);
                                    e.currentTarget.value = "";
                                  }}
                                />
                              </label>
                              {t.photoUrl && (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => void removePhoto()}
                                  className="rounded-xl border border-[#e4b8b3] bg-white px-4 py-2.5 text-sm font-semibold text-[#9a332b] hover:bg-[#fff5f4]"
                                >
                                  Remove photo
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Field title="Highest degree">
                      <input
                        value={t.highestDegree || ""}
                        onChange={(e) =>
                          setT((x) => ({
                            ...x,
                            highestDegree: e.target.value || null,
                          }))
                        }
                        className={input}
                        placeholder="e.g. M.Sc. in Physics"
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field title="University or institution">
                        <input
                          value={t.university || ""}
                          onChange={(e) =>
                            setT((x) => ({
                              ...x,
                              university: e.target.value || null,
                            }))
                          }
                          className={input}
                          placeholder="University name"
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field
                        title="Academic qualifications"
                        hint="Add one qualification per line."
                      >
                        <textarea
                          rows={4}
                          value={t.qualifications || ""}
                          onChange={(e) =>
                            setT((x) => ({
                              ...x,
                              qualifications: e.target.value || null,
                            }))
                          }
                          className={`${input} resize-y`}
                          placeholder={"B.Sc. in Physics\nM.Sc. in Physics"}
                        />
                      </Field>
                    </div>
                  </div>
                </section>
                <div className="h-px bg-[#e4eee5]" />
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f3e8] text-sm font-bold text-[#12643f]">
                      02
                    </span>
                    <div>
                      <h3 className="font-bold text-[#1b4930]">
                        Your teaching story
                      </h3>
                      <p className="text-xs text-[#718176]">
                        Help families get to know you
                      </p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <Field
                      title="About me"
                      hint="Share your experience, interests, or approach to teaching."
                    >
                      <textarea
                        rows={5}
                        value={t.biography || ""}
                        onChange={(e) =>
                          setT((x) => ({
                            ...x,
                            biography: e.target.value || null,
                          }))
                        }
                        className={`${input} resize-y`}
                        placeholder="Tell students and families a little about yourself…"
                      />
                    </Field>
                    <Field title="Favourite quote">
                      <textarea
                        rows={2}
                        value={t.quote || ""}
                        onChange={(e) =>
                          setT((x) => ({ ...x, quote: e.target.value || null }))
                        }
                        className={`${input} resize-y`}
                        placeholder="A quote that inspires your teaching"
                      />
                    </Field>
                    <Field
                      title="Message to students"
                      hint="A welcome message, encouragement, or advice for your students."
                    >
                      <textarea
                        rows={4}
                        value={t.studentMessage || ""}
                        onChange={(e) =>
                          setT((x) => ({
                            ...x,
                            studentMessage: e.target.value || null,
                          }))
                        }
                        className={`${input} resize-y`}
                        placeholder="What would you like your students to know?"
                      />
                    </Field>
                  </div>
                </section>
              </div>
              <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[#dce9de] bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p className="text-xs leading-5 text-[#718176]">
                  Remember to save your changes before leaving.
                </p>
                <button
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12643f] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0d4d30] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {busy ? "Saving profile…" : "Save profile changes"}
                </button>
              </div>
            </form>
            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-[#d4e4d7] bg-white p-5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#16734a]">
                  Profile preview
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#e5f2e7] text-lg font-bold text-[#12643f]">
                    {t.photoUrl ? (
                      <img
                        src={t.photoUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      t.name
                        .split(/\s+/)
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-bold text-[#173f2a]">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6a7e70]">
                      {t.designation}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3 border-t border-[#e4eee5] pt-4 text-sm">
                  <div>
                    <p className="text-xs text-[#718176]">Highest degree</p>
                    <p className="mt-1 font-medium">
                      {t.highestDegree || "Not added yet"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718176]">University</p>
                    <p className="mt-1 font-medium">
                      {t.university || "Not added yet"}
                    </p>
                  </div>
                </div>
                <a
                  href="/en/teachers"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-[#b9d5c1] px-4 py-2.5 text-sm font-semibold text-[#12643f] transition hover:bg-[#eff7f0]"
                >
                  View teacher directory ↗
                </a>
              </div>
              <div className="rounded-2xl border border-[#c9dfce] bg-[#e8f4e9] p-5">
                <h3 className="font-bold text-[#174e30]">A quick reminder</h3>
                <ul className="mt-3 space-y-2 text-sm leading-5 text-[#466b51]">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>
                      Employee ID, name, designation, wing and subjects are
                      managed by the school.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>
                      Your changes are saved securely when you select Save
                      profile changes.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>
                      School publication settings control when your profile
                      appears publicly.
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#092d1c]/75 p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Crop profile photo"
          >
            <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="border-b border-[#dce9de] px-5 py-4">
                <h2 className="text-lg font-bold text-[#153f2a]">
                  Adjust your profile photo
                </h2>
                <p className="mt-1 text-sm text-[#63786a]">
                  Drag to reposition, then zoom in or out.
                </p>
              </div>
              <div className="relative h-[min(68vh,420px)] bg-[#12271a]">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="space-y-4 p-5">
                <label className="block text-sm font-medium text-[#244b36]">
                  Zoom{" "}
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="mt-2 w-full accent-[#12643f]"
                  />
                </label>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setSelectedImage(null)}
                    className="rounded-xl border border-[#cbded1] px-4 py-3 text-sm font-semibold text-[#24543a]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void confirmPhotoCrop()}
                    className="rounded-xl bg-[#12643f] px-5 py-3 text-sm font-bold text-white hover:bg-[#0d4d30] disabled:opacity-60"
                  >
                    {busy ? "Uploading photo…" : "Crop and upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <footer className="py-7 text-center text-xs text-[#829186]">
          KCMSC Teacher Portal <span className="px-1.5">·</span> Keep inspiring
          curiosity.
        </footer>
      </div>
    </main>
  );
}
