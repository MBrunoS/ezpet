"use client";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { useStock } from "../hooks/useStock";
import { useAppointments } from "../hooks/useAppointments";
import NotificacaoItem from "./NotificacaoItem";
import { Product, Appointment } from "../types";
import { SidebarTrigger } from "./ui/sidebar";

export default function Navbar(): React.ReactElement {
  const { user, signOut } = useAuth();
  const { lowStockProducts } = useStock();
  const { appointmentsToday: agendamentosHoje } = useAppointments();
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const totalNotifications = lowStockProducts.length + agendamentosHoje.length;

  return (
    <header className="flex justify-between items-center px-10 py-3 whitespace-nowrap border-b border-solid border-b-border">
      <div className="flex gap-4 items-center text-text">
        <SidebarTrigger />
        <h2 className="text-text text-lg font-bold leading-tight tracking-[-0.015em]">
          EzPet
        </h2>
      </div>

      {user && (
        <div className="flex flex-1 gap-8 justify-end items-center">
          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-2 rounded-full transition-colors text-text hover:bg-background-light"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell className="text-lg" />
              {totalNotifications > 0 && (
                <span className="flex absolute top-0 right-0 justify-center items-center w-4 h-4 text-xs text-white rounded-full bg-error">
                  {totalNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border shadow-lg bg-background border-border text-text">
                <div className="p-3 border-b border-border">
                  <h3 className="font-medium text-text">Notificações</h3>
                </div>
                <div className="overflow-y-auto max-h-80">
                  {lowStockProducts.length === 0 &&
                    agendamentosHoje.length === 0 && (
                      <p className="p-4 text-sm text-text-light">
                        Nenhuma notificação
                      </p>
                    )}

                  {lowStockProducts.map((produto: Product) => (
                    <NotificacaoItem
                      key={`produto-${produto.id}`}
                      tipo="estoque"
                      titulo={`Estoque baixo: ${produto.name}`}
                      descricao={`Restam apenas ${produto.quantity} unidades`}
                      link={`/estoque`}
                    />
                  ))}

                  {agendamentosHoje.map((agendamento: Appointment) => (
                    <NotificacaoItem
                      key={`agendamento-${agendamento.id}`}
                      tipo="agendamento"
                      titulo={`Agendamento hoje: ${agendamento.service}`}
                      descricao={`Cliente: ${agendamento.clientName} - Pet: ${agendamento.petName}`}
                      link={`/appointments`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            className="flex gap-2 items-center px-3 py-2 rounded-lg transition-colors text-text hover:bg-background-light"
          >
            <FaSignOutAlt />
            <span>Sair</span>
          </button>

          {/* User Avatar */}
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full aspect-square size-10"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJbK9z0BCNs47vaHbTwP7S4T12XD3dxJF2t1mdbGp-erfILFksvVUNrfuF_0IhVq9tb3aFjsAXjwbCxRseWsYualtghf18Xq4RxlfNFY5LJKvnHSdWxHGkGIz97gXN0DOALQ-eo__XXH1FDWijnRq6WTM_Zj5pwzDx3PRjfIiCiy2cJTGRPwsWQzHN6ohzQHMoYe9uoE8DACAtCYyH5YPpNQEl_oW5fDuhHLo3JGqzs9xW8n6T96o63jHpFN9o16XYBsqzD2G1aotj")',
            }}
          ></div>
        </div>
      )}
    </header>
  );
}
