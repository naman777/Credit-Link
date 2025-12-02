import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Credit-Link - Micro-lending Made Simple",
  description:
    "A peer-to-peer micro-lending platform connecting borrowers and lenders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center text-xl font-semibold animate-pulse">
                Preparing something interesting…
              </div>
            }
          >
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}