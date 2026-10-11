import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K C Model School & College",
  description:
    "Official website of K C Model School & College, Dakshinkhan, Dhaka.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
