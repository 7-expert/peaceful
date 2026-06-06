import type { Metadata } from "next";
import { MarketProvider } from "../context/MarketContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peaceful Dental Solutions | Premium Dental & Surgical Instruments",
  description: "Certified, high-grade German and American stainless steel dental instruments. Trusted by clinics, surgical centers, and distributors across Pakistan and 45+ countries worldwide.",
  keywords: "dental instruments, surgical instruments, extracting forceps, dental pliers, suture kits, Pakistan exporter, international dental supply, Peaceful Dental Solutions",
  icons: {
    icon: "/logo4.png",
    shortcut: "/logo4.png",
    apple: "/logo4.png",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-accent-blue selection:text-white">
        <MarketProvider>
          {children}
        </MarketProvider>
      </body>
    </html>
  );
}
