import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import Appbar from "@/components/AppBar";
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

import { FC, ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased dark dark:bg-black dark:text-white`}
      >
        <Providers>
          <div className="h-screen w-screen overflow-hidden relative">
            <Appbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
