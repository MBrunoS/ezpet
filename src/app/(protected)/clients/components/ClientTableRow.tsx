"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, PawPrint } from "lucide-react";
import { ClientWithPets } from "@/types";

interface ClientTableRowProps {
  client: ClientWithPets;
  onEdit: (client: ClientWithPets) => void;
  onDelete: (client: ClientWithPets) => void;
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
      <TableCell>{client.phone}</TableCell>
      <TableCell>
        {client.address ? (
          <div className="max-w-xs text-sm text-gray-600 truncate">
            {client.address}
          </div>
        ) : (
          <span className="text-sm text-gray-400">Não informado</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          <PawPrint className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{client.pets.length}</span>
          <span className="text-sm text-gray-500">pets</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {client.pets.slice(0, 2).map((pet, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">{pet.name}</span>
              <span className="ml-1 text-gray-500">
                ({pet.species} • {pet.breed})
              </span>
            </div>
          ))}
          {client.pets.length > 2 && (
            <div className="text-sm text-gray-500">
              +{client.pets.length - 2} mais...
            </div>
          )}
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
