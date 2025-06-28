"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";
import { ClientTableRow } from "./ClientTableRow";
import { ClientWithPets } from "@/types";

interface ClientTableProps {
  clients: ClientWithPets[];
  onEdit: (client: ClientWithPets) => void;
  onDelete: (client: ClientWithPets) => void;
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="py-8 text-center">
        <Users className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <p className="text-gray-500">Nenhum cliente cadastrado</p>
        <p className="text-sm text-gray-400">
          Clique em "Novo Cliente" para começar
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Total de Pets</TableHead>
            <TableHead>Pets</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <ClientTableRow
              key={client.id}
              client={client}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
