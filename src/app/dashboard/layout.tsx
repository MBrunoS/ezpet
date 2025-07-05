import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DialogProvider } from "@/contexts/DialogContext";
import { GlobalDialogs } from "@/components/GlobalDialogs";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <DialogProvider>
        <SidebarProvider>
          <div className="flex w-full h-screen">
            <AppSidebar />
            <div className="overflow-y-auto flex-1">
              <main className="p-10">{children}</main>
            </div>
          </div>
          <GlobalDialogs />
        </SidebarProvider>
      </DialogProvider>
    </ProtectedRoute>
  );
}
