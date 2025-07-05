"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./ui/nav-user";
import {
  CalendarIcon,
  House,
  LayoutList,
  Package,
  UserRoundPen,
  Users,
} from "lucide-react";

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { open } = useSidebar();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const items: MenuItem[] = [
    {
      text: "Painel",
      icon: <House className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      text: "Estoque",
      icon: <Package className="w-5 h-5" />,
      path: "/dashboard/stock",
    },
    {
      text: "Agendamentos",
      icon: <CalendarIcon className="w-5 h-5" />,
      path: "/dashboard/appointments",
    },
    {
      text: "Clientes",
      icon: <Users className="w-5 h-5" />,
      path: "/dashboard/clients",
    },
    {
      text: "Serviços",
      icon: <LayoutList className="w-5 h-5" />,
      path: "/dashboard/services",
    },
    {
      text: "Perfil",
      icon: <UserRoundPen className="w-5 h-5" />,
      path: "/dashboard/profile",
    },
  ];

  return (
    <Sidebar collapsible="icon" className="bg-stone-50">
      <SidebarHeader className="flex justify-between items-center p-4 border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between items-center">
            <SidebarMenuButton
              size="lg"
              className="text-sm leading-tight text-left"
            >
              {open && (
                <Link href="/dashboard">
                  <span className="font-medium truncate">EzPet</span>
                </Link>
              )}
            </SidebarMenuButton>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.path}
                    className="px-3 [&[data-active=true]]:text-primary"
                  >
                    <Link href={item.path}>
                      {item.icon}
                      <span>{item.text}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        {user && (
          <div className="flex flex-col gap-3">
            <NavUser
              user={{
                name: user.displayName || "",
                email: user.email || "",
                avatar: user.photoURL || "",
              }}
              onLogout={handleLogout}
            />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
