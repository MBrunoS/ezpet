"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FaBell, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar(): React.ReactElement {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="flex sticky top-0 z-50 justify-between items-center px-10 py-3 whitespace-nowrap border-b border-solid bg-background border-b-border">
      <div className="flex gap-4 items-center text-text">
        <SidebarTrigger />
        <h2 className="text-text text-lg font-bold leading-tight tracking-[-0.015em]">
          EzPet
        </h2>
      </div>

      {user && (
        <div className="flex flex-1 gap-8 justify-end items-center">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-full transition-colors text-text hover:bg-background-light">
                <FaBell className="text-lg" />
                {/* Badge de notificações - pode ser implementado depois */}
                {/* <span className="flex absolute top-0 right-0 justify-center items-center w-4 h-4 text-xs text-white rounded-full bg-error">
                  3
                </span> */}
              </button>
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
                    <span className="text-sm font-medium">
                      Agendamento hoje
                    </span>
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

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex gap-2 items-center px-3 py-2 rounded-lg transition-colors text-text hover:bg-background-light">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full aspect-square size-8"
                  style={{
                    backgroundImage: user.photoURL
                      ? `url("${user.photoURL}")`
                      : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E\")",
                  }}
                ></div>
                <span className="text-sm text-text">{user.displayName}</span>
                <FaChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <FaSignOutAlt className="mr-2 w-4 h-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}

