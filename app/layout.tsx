import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "./globals.css";

const MetaPixel = dynamic(
  () => import("@/components/analytics/MetaPixel"),
  { ssr: false }
);
const GoogleAnalytics = dynamic(
  () => import("@/components/analytics/GoogleAnalytics"),
  { ssr: false }
);

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
      <body>
        {children}
        <MetaPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
