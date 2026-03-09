import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";
import { Amplitude } from "@/lib/amplitude";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: "Boundless",
  description: "Breaking Barriers to Global Education",
  icons: {
    icon: '/favicon.ico', 
    shortcut: '/logo.png', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <Amplitude />
      <body
        className={`${fontSans.variable} font-sans antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
