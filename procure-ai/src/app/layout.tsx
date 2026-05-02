import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { AppProvider } from "@/context/AppContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
  title: "ProcureAI | Government Tender Evaluation",
  description: "AI-powered AI-powered Tender Evaluation and Eligibility Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex overflow-hidden bg-slate-50">
        <AppProvider>
          <ToastProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopNav />
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </div>
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}

