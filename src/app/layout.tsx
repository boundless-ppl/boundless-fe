import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";
import { Amplitude } from "@/lib/amplitude";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Boundless",
  description: "Membantu Anda menembus batas untuk meraih beasiswa S2 ke luar negeri melalui informasi terpercaya, panduan terstruktur, dan persiapan yang tepat.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("font-sans", plusJakartaSans.variable)}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Amplitude />
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
