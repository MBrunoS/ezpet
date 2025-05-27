"use client";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Link from "next/link";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { useEstoque } from "../hooks/useEstoque";
import { useAgendamentos } from "../hooks/useAgendamentos";
import NotificacaoItem from "./NotificacaoItem";
import { Produto, Agendamento } from "../types";

export default function Navbar(): React.ReactElement {
  const { user, signOut } = useAuth();
  const { produtosBaixoEstoque } = useEstoque();
  const { agendamentosHoje } = useAgendamentos();
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const totalNotificacoes =
    produtosBaixoEstoque.length + agendamentosHoje.length;

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          EzPet
        </Link>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="p-2 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell className="text-lg" />
                {totalNotificacoes > 0 && (
                  <span className="absolute top-0 right-0 bg-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalNotificacoes}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 text-gray-800">
                  <div className="p-2 border-b">
                    <h3 className="font-medium">Notificações</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {produtosBaixoEstoque.length === 0 &&
                      agendamentosHoje.length === 0 && (
                        <p className="p-4 text-sm text-gray-500">
                          Nenhuma notificação
                        </p>
                      )}

                    {produtosBaixoEstoque.map((produto: Produto) => (
                      <NotificacaoItem
                        key={`produto-${produto.id}`}
                        tipo="estoque"
                        titulo={`Estoque baixo: ${produto.nome}`}
                        descricao={`Restam apenas ${produto.quantidade} unidades`}
                        link={`/estoque`}
                      />
                    ))}

                    {agendamentosHoje.map((agendamento: Agendamento) => (
                      <NotificacaoItem
                        key={`agendamento-${agendamento.id}`}
                        tipo="agendamento"
                        titulo={`Agendamento hoje: ${agendamento.servico}`}
                        descricao={`Cliente: ${agendamento.clienteNome} - Pet: ${agendamento.petNome}`}
                        link={`/agendamentos`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={signOut}
              className="flex items-center space-x-1 p-2 hover:bg-primary-dark rounded-md"
            >
              <FaSignOutAlt />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
