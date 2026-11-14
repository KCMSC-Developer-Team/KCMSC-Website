"use client";

import { useState, type ChangeEvent } from "react";
import { compressImageForUpload } from "@/lib/compress-image";

const MAX_IMAGES = 10;

// Each chosen image is compressed in the browser and uploaded straight away.
// The resulting URLs are submitted with the notice form as hidden "imageUrls" inputs.
export function NoticeImageField({ defaultUrls = [] }: { defaultUrls?: string[] }) {
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    if (urls.length + files.length > MAX_IMAGES) {
      setError(`You can attach up to ${MAX_IMAGES} images per notice.`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      for (const file of files) {
        const prepared = await compressImageForUpload(file);
        const body = new FormData();
        body.append("image", prepared);

        const response = await fetch("/api/admin/notices/images", { method: "POST", body });
        const result = (await response.json().catch(() => null)) as
          | { url?: string; error?: string }
          | null;
        if (!response.ok || !result?.url) {
          throw new Error(result?.error ?? "Upload failed.");
        }
        const uploadedUrl = result.url;
        setUrls((previous) => [...previous, uploadedUrl]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="block text-sm font-medium text-ink">News image(s)</p>
      <p className="mt-0.5 text-xs leading-5 text-ink-muted">
        JPG, PNG or WebP. Each image is optimised and stored as soon as it is chosen. Up to {MAX_IMAGES} images.
      </p>

      {urls.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {urls.map((url, index) => (
            <li key={url} className="relative overflow-hidden rounded-md border border-border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`News image ${index + 1}`} className="aspect-square w-full object-cover" />
              <input type="hidden" name="imageUrls" value={url} />
              <button
                type="button"
                onClick={() => setUrls((previous) => previous.filter((item) => item !== url))}
                className="absolute right-1 top-1 rounded bg-white/90 px-2 py-0.5 text-xs text-brick hover:bg-white"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={uploading || urls.length >= MAX_IMAGES}
        onChange={handleSelect}
        className="mt-3 block w-full text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-dark disabled:opacity-50"
      />

      {uploading ? <p className="mt-2 text-xs text-ink-muted">Optimising and uploading…</p> : null}
      {error ? <p className="mt-2 text-xs text-brick">{error}</p> : null}
    </div>
  );
}
