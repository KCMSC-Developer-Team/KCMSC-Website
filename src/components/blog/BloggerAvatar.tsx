"use client";

import { useEffect, useState } from "react";

function usableImageUrl(photoUrl: string | null) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("/") && !photoUrl.startsWith("//")) return photoUrl;

  try {
    const url = new URL(photoUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? photoUrl
      : null;
  } catch {
    return null;
  }
}

export default function BloggerAvatar({
  name,
  photoUrl,
  className,
  fallback,
}: {
  name: string;
  photoUrl: string | null;
  className: string;
  fallback?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = usableImageUrl(photoUrl);
  const initial = fallback || name.trim().charAt(0).toUpperCase() || "K";

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return (
    <span className={className}>
      {imageUrl && !imageFailed ? (
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
}
