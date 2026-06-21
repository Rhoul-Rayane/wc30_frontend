import type { Metadata } from "next";
import { Inter, Outfit, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/hooks/AuthContext";
import AuthModal from "@/components/features/AuthModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA World Cup 2030 | Maroc — Portail Officiel",
  description: "Portail numérique officiel de la Coupe du Monde FIFA 2030 au Maroc. Portail de billetterie, accréditations, planification des volontaires et centre de commandement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f4f4f5] selection:bg-[#34d399]/30 selection:text-[#34d399] font-sans"
        suppressHydrationWarning
      >
        <AuthProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
