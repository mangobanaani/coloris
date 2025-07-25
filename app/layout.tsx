import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Coloris Game",
  description: "A modern color-matching puzzle game built with Next.js and React",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#1e1b4b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Coloris"
  }
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
