import type { Metadata } from "next";

import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "ByteBridgeX",
  description: "Where Code Meets Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans text-foreground">
        <AppProviders>
          <div className="relative min-h-screen">
            <Navbar />
            <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-28 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
