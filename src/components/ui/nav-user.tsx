"use client";

import { Bell, ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout: () => void;
}

export function NavUser({ user, onLogout }: NavUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Bell />
              <span>Notificações</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>
              <div className="flex justify-between items-center">
                <span>Notificações</span>
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  Marcar todas como lidas
                </button>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="overflow-y-auto max-h-64">
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="flex gap-2 items-center mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Estoque baixo</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Produto "Ração Premium" está com estoque baixo (5 unidades)
                </p>
                <span className="mt-1 text-xs text-muted-foreground">
                  Há 2 horas
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="flex gap-2 items-center mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Agendamento hoje</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cliente "João Silva" - Pet "Rex" às 14:00
                </p>
                <span className="mt-1 text-xs text-muted-foreground">
                  Há 30 minutos
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="flex gap-2 items-center mb-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Novo cliente</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cliente "Maria Santos" foi cadastrado
                </p>
                <span className="mt-1 text-xs text-muted-foreground">
                  Ontem
                </span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-center">
              <span className="text-sm text-muted-foreground">
                Ver todas as notificações
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="w-8 h-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-xs truncate">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User />
                  Perfil
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
