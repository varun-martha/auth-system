import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Authentication System",
  description:
    "Modern authentication webapp with credentials and Google sign-in."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
