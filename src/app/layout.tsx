import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("public/kcmsc/hero/kcmsc-building.jpg"),
  title: "K C Model School & College",
  description:
    "Official website of K C Model School & College, Dakshinkhan, Dhaka.",
  openGraph: {
    images: [
      {
        url: "/kcmsc/hero/kcmsc-building.jpg",
        width: 3200,
        height: 1800,
        alt: "K C Model School & College building",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/kcmsc/hero/kcmsc-building.jpg"],
  },
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
