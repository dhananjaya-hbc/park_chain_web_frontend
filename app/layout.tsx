'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded, Sora } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { NotificationToast } from "@/components/notifications/NotificationToast";
import { FcmDiagnosticsWrapper } from "@/components/debug/FcmDiagnostics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${sora.variable} antialiased`}
      >
        <NotificationProvider>
          {children}
          <NotificationToast />
          <FcmDiagnosticsWrapper />
        </NotificationProvider>
      </body>
    </html>
  );
}