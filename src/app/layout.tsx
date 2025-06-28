import React from "react";
import "./globals.css";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
});

export const metadata = {
  title: "EzPet - Sistema de Gestão para Pet Shops",
  description: "Sistema de gestão simples para pequenos pet shops",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body
        className={`${spaceGrotesk.variable} ${notoSans.variable} font-sans bg-background min-h-screen`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
