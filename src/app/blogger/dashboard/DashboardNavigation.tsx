"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import BloggerAvatar from "@/components/blog/BloggerAvatar";
import {
  FiBookOpen,
  FiExternalLink,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiUpload,
} from "react-icons/fi";

const navigation = [
  { label: "Overview", href: "/blogger/dashboard", icon: FiGrid },
  { label: "Your articles", href: "#articles", icon: FiFileText },
  {
    label: "Write an article",
    href: "/blogger/articles/new",
    icon: FiBookOpen,
  },
];

export function BloggerSidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#123b2d] px-5 py-6 text-white lg:flex">
        <Link href="/blogger/dashboard" className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1">
            <img
              src="/kcmsc/kcmsc-logo.png"
              alt="K C Model School & College logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span>
            <span className="block font-semibold tracking-wide">
              KCMSC Journal
            </span>
            <span className="mt-0.5 block text-xs text-white/60">
              Blogger workspace
            </span>
          </span>
        </Link>

        <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/45">
          Workspace
        </p>
        <nav aria-label="Blogger workspace" className="space-y-1">
          {navigation.map(({ label, href, icon: Icon }, index) => (
            <Link
              key={label}
              href={href}
              aria-current={index === 0 ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                index === 0
                  ? "bg-white/12 font-semibold text-white"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon aria-hidden="true" size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/en/blog"
          className="mt-8 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
        >
          <FiExternalLink aria-hidden="true" size={17} />
          View public journal
        </Link>

        <div className="mt-auto border-t border-white/10 pt-5">
          <Link
            href="/blogger/profile"
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
          >
            <FiSettings aria-hidden="true" size={17} />
            Account settings
          </Link>
          <button
            type="button"
            onClick={() => void signOut({ callbackUrl: "/blogger/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
          >
            <FiLogOut aria-hidden="true" size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="border-b border-[#e4e8e1] bg-white px-4 py-4 lg:hidden">
        <Link href="/blogger/dashboard" className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1">
            <img
              src="/kcmsc/kcmsc-logo.png"
              alt="K C Model School & College logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span>
            <span className="block font-semibold text-[#193d2e]">
              KCMSC Journal
            </span>
            <span className="text-xs text-[#758078]">Blogger workspace</span>
          </span>
        </Link>
        <nav
          aria-label="Blogger workspace"
          className="mt-4 flex gap-2 overflow-x-auto pb-1"
        >
          {navigation.map(({ label, href, icon: Icon }, index) => (
            <Link
              key={label}
              href={href}
              aria-current={index === 0 ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                index === 0
                  ? "bg-[#e8f0e9] text-[#176b45]"
                  : "bg-[#f5f6f3] text-[#5d685f]"
              }`}
            >
              <Icon aria-hidden="true" size={15} />
              {label}
            </Link>
          ))}
          <Link
            href="/blogger/profile"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#f5f6f3] px-3 py-2 text-xs font-medium text-[#5d685f]"
          >
            <FiSettings aria-hidden="true" size={15} />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => void signOut({ callbackUrl: "/blogger/login" })}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#f5f6f3] px-3 py-2 text-xs font-medium text-[#5d685f]"
          >
            <FiLogOut aria-hidden="true" size={15} />
            Sign out
          </button>
        </nav>
      </div>
    </>
  );
}

export function BloggerProfileMenu({
  displayName,
  roleLabel,
  photoUrl,
}: {
  displayName: string;
  roleLabel: string;
  photoUrl: string | null;
}) {
  const router = useRouter();
  const [photo, setPhoto] = useState(photoUrl);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "KC";
  const onCropComplete = useCallback(
    (_area: Area, pixels: Area) => setCroppedAreaPixels(pixels),
    [],
  );

  useEffect(() => {
    setPhoto(photoUrl);
  }, [photoUrl]);

  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        setSelectedImage(null);
        setCroppedAreaPixels(null);
        if (fileInput.current) fileInput.current.value = "";
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, busy]);

  function choosePhoto(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("The image must be smaller than 8 MB.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }

    setError("");
    setCroppedAreaPixels(null);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(String(reader.result));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.onerror = () => {
      setError("Could not read this image. Please try another.");
      if (fileInput.current) fileInput.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  async function uploadPhoto() {
    if (!selectedImage || !croppedAreaPixels) return;
    setBusy(true);
    setError("");
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
      const context = canvas.getContext("2d");
      if (!context)
        throw new Error("Image editing is not supported in this browser.");
      context.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (result) =>
            result
              ? resolve(result)
              : reject(new Error("Could not crop this image.")),
          "image/jpeg",
          0.88,
        ),
      );
      const form = new FormData();
      form.set("photo", blob, "blogger-profile.jpg");
      const response = await fetch("/api/blog/photo", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to upload the photo.");
      setPhoto(result.photoUrl);
      setSelectedImage(null);
      setCroppedAreaPixels(null);
      if (fileInput.current) fileInput.current.value = "";
      setOpen(false);
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "A network error occurred. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/blog/photo", { method: "DELETE" });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to remove the photo.");
      setPhoto(null);
      router.refresh();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "A network error occurred. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Choose a profile photo"
        onChange={(event) => choosePhoto(event.target.files?.[0])}
      />
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Profile menu for ${displayName}`}
        onClick={() => {
          setOpen((value) => !value);
          setError("");
        }}
        className="flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#176b45] focus-visible:ring-offset-2"
      >
        <span className="hidden text-right sm:block">
          <span className="block text-sm font-semibold text-[#263c2f]">
            {displayName}
          </span>
          <span className="block text-xs text-[#778078]">{roleLabel}</span>
        </span>
        <BloggerAvatar
          name={displayName}
          photoUrl={photo}
          fallback={initials}
          className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[#dce4da] bg-[#e8f0e9] text-sm font-bold text-[#176b45]"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 z-40 mt-3 w-64 rounded-2xl border border-[#e1e7df] bg-white p-2 shadow-xl"
          aria-label="Profile options"
        >
          <div className="border-b border-[#edf0eb] px-3 py-3">
            <p className="truncate text-sm font-semibold text-[#263c2f]">
              {displayName}
            </p>
            <p className="mt-1 text-xs text-[#778078]">{roleLabel}</p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm text-[#35483b] hover:bg-[#f5f7f3] disabled:opacity-60"
          >
            <FiUpload aria-hidden="true" size={16} />
            {busy
              ? "Updating photo…"
              : photo
                ? "Change profile photo"
                : "Add profile photo"}
          </button>
          {photo && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void removePhoto()}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#8b3c36] hover:bg-[#fbf1f0] disabled:opacity-60"
            >
              Remove photo
            </button>
          )}
          {error && (
            <p role="alert" className="px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
          <Link
            href="/blogger/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm text-[#35483b] hover:bg-[#f5f7f3]"
          >
            <FiSettings aria-hidden="true" size={16} />
            Account settings
          </Link>
          <button
            type="button"
            onClick={() => void signOut({ callbackUrl: "/blogger/login" })}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm text-[#35483b] hover:bg-[#f5f7f3]"
          >
            <FiLogOut aria-hidden="true" size={16} />
            Sign out
          </button>
        </div>
      )}
      {selectedImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#101b14]/70 p-3 backdrop-blur-sm sm:p-4"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !busy) {
                setSelectedImage(null);
                setCroppedAreaPixels(null);
                if (fileInput.current) fileInput.current.value = "";
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-photo-title"
              className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
            >
              <header className="shrink-0 border-b border-[#e7ebe5] px-5 py-4">
                <h2
                  id="profile-photo-title"
                  className="font-serif text-xl font-semibold text-[#203a2c]"
                >
                  Adjust your profile photo
                </h2>
                <p className="mt-1 text-sm text-[#69766d]">
                  Drag to reposition, then adjust the zoom.
                </p>
              </header>
              <div className="flex shrink-0 justify-center bg-[#18221b] px-4 py-3">
                <div
                  className="relative aspect-square"
                  style={{ width: "min(100%, 360px, 42dvh)" }}
                >
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
              </div>
              <div className="shrink-0 space-y-4 p-5">
                <label
                  htmlFor="profile-photo-zoom"
                  className="block text-sm font-medium text-[#35483b]"
                >
                  Zoom <span className="text-[#778078]">{zoom.toFixed(1)}×</span>
                  <input
                    id="profile-photo-zoom"
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="mt-2 w-full accent-[#176b45]"
                  />
                </label>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setSelectedImage(null);
                      setCroppedAreaPixels(null);
                      if (fileInput.current) fileInput.current.value = "";
                    }}
                    className="rounded-xl border border-[#cbded1] px-4 py-3 text-sm font-semibold text-[#24543a] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={busy || !croppedAreaPixels}
                    onClick={() => void uploadPhoto()}
                    className="rounded-xl bg-[#176b45] px-5 py-3 text-sm font-semibold text-white hover:bg-[#124c36] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? "Saving…" : "Save Photo"}
                  </button>
                </div>
              </div>
            </section>
          </div>,
          document.body,
        )}
    </div>
  );
}
