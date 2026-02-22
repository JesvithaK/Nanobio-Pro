import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Sidebar from "@/components/layout/sidebar"; // Adjust path if needed
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NANOBIO PRO | Research Terminal",
  description: "Advanced PhD-level Nanobiotechnology Learning Environment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {/* REMOVED overflow-hidden so the page can scroll normally */}
      <body className={`${inter.variable} ${mono.variable} font-sans bg-slate-950 text-slate-200 flex min-h-screen`}>
        
        {/* SIDEBAR (Sticky on the left) */}
        <Sidebar />

        {/* MAIN CONTENT (Scrolls naturally) */}
        <main className="flex-1 min-w-0 relative flex flex-col">
          {/* Ambient Lighting Overlay */}
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.05),transparent_70%)]" />
          
          <div className="relative z-10 flex-1">
            {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}