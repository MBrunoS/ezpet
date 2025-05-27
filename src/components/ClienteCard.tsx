import React from "react";
import { Cliente } from "../types";

interface ClienteCardProps {
  cliente: Cliente;
  onEditar: (cliente: Cliente) => void;
  onExcluir: (id: string) => void;
  onVerDetalhes: (cliente: Cliente) => void;
}

export default function ClienteCard({
  cliente,
  onEditar,
  onExcluir,
  onVerDetalhes,
}: ClienteCardProps): React.ReactElement {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{cliente.nome}</h3>

        <div className="mt-2 text-sm text-gray-500">
          {cliente.telefone && <p>{cliente.telefone}</p>}
          {cliente.email && <p className="truncate">{cliente.email}</p>}
        </div>

        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700">
            Pets: {cliente.pets?.length || 0}
          </p>
          {cliente.pets && cliente.pets.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {cliente.pets.slice(0, 3).map((pet, index) => (
                <span
                  key={pet.id || index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary"
                >
                  {pet.nome}
                </span>
              ))}
              {cliente.pets.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{cliente.pets.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between space-x-2">
          <button
            onClick={() => onVerDetalhes(cliente)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Detalhes
          </button>
          <button
            onClick={() => onEditar(cliente)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Editar
          </button>
          <button
            onClick={() => onExcluir(cliente.id)}
            className="flex-1 px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-error hover:bg-error-dark"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
