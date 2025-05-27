import React from "react";
import { formatDateTime, formatCurrency } from "../lib/utils";
import { Agendamento } from "../types";

interface AgendamentoCardProps {
  agendamento: Agendamento;
  onEditar: (agendamento: Agendamento) => void;
  onExcluir: (id: string) => void;
  onConcluir: (id: string) => void;
}

export default function AgendamentoCard({
  agendamento,
  onEditar,
  onExcluir,
  onConcluir,
}: AgendamentoCardProps): React.ReactElement {
  const getStatusStyle = (): string => {
    switch (agendamento.status) {
      case "agendado":
        return "bg-primary text-white";
      case "concluido":
        return "bg-success text-white";
      case "cancelado":
        return "bg-error text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">
            {agendamento.servicoNome}
          </h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${getStatusStyle()}`}
          >
            {agendamento.status === "agendado"
              ? "Agendado"
              : agendamento.status === "concluido"
              ? "Concluído"
              : agendamento.status === "cancelado"
              ? "Cancelado"
              : "Pendente"}
          </span>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Cliente:</span>{" "}
            {agendamento.clienteNome}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Pet:</span> {agendamento.petNome}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Data:</span>{" "}
            {formatDateTime(agendamento.data)}
          </p>
          <p className="text-sm font-medium text-gray-900 mt-2">
            {formatCurrency(agendamento.valor)}
          </p>
        </div>

        {agendamento.observacoes && (
          <p className="mt-2 text-xs text-gray-500 italic">
            {agendamento.observacoes}
          </p>
        )}

        <div className="mt-4 flex justify-between space-x-2">
          {agendamento.status === "agendado" && (
            <>
              <button
                onClick={() => onConcluir(agendamento.id)}
                className="flex-1 px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-success hover:bg-success-dark"
              >
                Concluir
              </button>
              <button
                onClick={() => onEditar(agendamento)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Editar
              </button>
              <button
                onClick={() => onExcluir(agendamento.id)}
                className="flex-1 px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-error hover:bg-error-dark"
              >
                Cancelar
              </button>
            </>
          )}

          {agendamento.status !== "agendado" && (
            <button
              onClick={() => onExcluir(agendamento.id)}
              className="flex-1 px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-error hover:bg-error-dark"
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
