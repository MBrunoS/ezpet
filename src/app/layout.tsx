import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-background min-h-screen`}>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
            <Navbar />
            <main className="p-4">{children}</main>
          </div>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
