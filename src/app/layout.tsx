import type { Metadata, Viewport } from "next";
import "@fontsource/sansita/800-italic.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/700.css";
import "@fontsource/noto-serif/400.css";
import "@fontsource/noto-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hostel",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
