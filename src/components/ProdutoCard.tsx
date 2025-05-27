import React from "react";
import { formatCurrency } from "../lib/utils";
import { Produto } from "../types";

interface ProdutoCardProps {
  produto: Produto;
  onEditar: (produto: Produto) => void;
  onExcluir: (id: string) => void;
}

export default function ProdutoCard({
  produto,
  onEditar,
  onExcluir,
}: ProdutoCardProps): React.ReactElement {
  const estoqueStatus =
    produto.quantidade <= produto.estoqueMinimo
      ? "bg-error text-white"
      : produto.quantidade <= produto.estoqueMinimo * 2
      ? "bg-warning text-white"
      : "bg-success text-white";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{produto.nome}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${estoqueStatus}`}>
            {produto.quantidade} unid.
          </span>
        </div>

        <p className="mt-1 text-gray-500 text-sm truncate">
          {produto.descricao || "Sem descrição"}
        </p>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(produto.preco)}
            </span>
            <span className="text-sm text-gray-500">
              Min: {produto.estoqueMinimo}
            </span>
          </div>

          <div className="mt-3 flex justify-between space-x-2">
            <button
              onClick={() => onEditar(produto)}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Editar
            </button>
            <button
              onClick={() => onExcluir(produto.id)}
              className="flex-1 px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-error hover:bg-error-dark"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
