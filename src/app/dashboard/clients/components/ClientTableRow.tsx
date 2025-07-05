"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, PawPrint } from "lucide-react";
import { Client } from "@/types";
import { formatPhone } from "@/lib/utils";

interface ClientTableRowProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientTableRow({
  client,
  onEdit,
  onDelete,
}: ClientTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{client.name}</div>
          <div className="text-sm text-gray-500">{client.email}</div>
        </div>
      </TableCell>
      <TableCell>{formatPhone(client.phone)}</TableCell>
      <TableCell>
        {client.address ? (
          <div className="max-w-xs text-sm text-gray-600 truncate">
            {`${client.address.street}, ${client.address.number} - ${client.address.neighborhood}, ${client.address.city}/${client.address.state}`}
          </div>
        ) : (
          <span className="text-sm text-gray-400">Não informado</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          <PawPrint className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{client.petsCount}</span>
          <span className="text-sm text-gray-500">pets</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end items-center">
          <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(client)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
