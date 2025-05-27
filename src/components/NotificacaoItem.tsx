import React from "react";
import { FaBoxOpen, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";

interface NotificacaoItemProps {
  tipo: "estoque" | "agendamento";
  titulo: string;
  descricao: string;
  link: string;
}

export default function NotificacaoItem({
  tipo,
  titulo,
  descricao,
  link,
}: NotificacaoItemProps): React.ReactElement {
  return (
    <Link
      href={link}
      className="block border-b last:border-b-0 p-3 hover:bg-gray-50"
    >
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          {tipo === "estoque" ? (
            <FaBoxOpen className="text-warning" />
          ) : (
            <FaCalendarAlt className="text-primary" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{titulo}</p>
          <p className="text-xs text-gray-500">{descricao}</p>
        </div>
      </div>
    </Link>
  );
}
