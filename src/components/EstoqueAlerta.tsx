import React from "react";
import { Produto } from "../types";

interface EstoqueAlertaProps {
  produtos: Produto[];
}

export default function EstoqueAlerta({
  produtos,
}: EstoqueAlertaProps): React.ReactElement | null {
  if (!produtos || produtos.length === 0) return null;

  return (
    <div className="bg-warning-light border-l-4 border-warning p-4 rounded-md">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-warning"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-warning-dark">
            <strong>Atenção!</strong> {produtos.length}{" "}
            {produtos.length === 1 ? "produto está" : "produtos estão"} com
            estoque baixo.
          </p>
        </div>
      </div>
    </div>
  );
}
