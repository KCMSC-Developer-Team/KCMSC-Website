import type { Metadata } from "next";
import { Providers } from "./providers";
import "./admin.css";

export const metadata: Metadata = {
  title: "KCMSC Admin",
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-ink">
      <Providers>{children}</Providers>
    </div>
  );
}
