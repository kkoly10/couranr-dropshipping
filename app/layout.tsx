import type { Metadata } from "next";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Couranr — Desk Setup & Home Organization",
  description:
    "Curated desk setup and small-space home organization products. U.S. fulfilled, ships in 2–8 business days.",
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
