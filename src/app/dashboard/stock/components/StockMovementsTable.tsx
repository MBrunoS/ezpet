"use client";

import React from "react";
import { ArrowUp, ArrowDown, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockMovement } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface StockMovementsTableProps {
  movements: StockMovement[];
}

export function StockMovementsTable({ movements }: StockMovementsTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getMovementIcon = (type: "entrada" | "saida") => {
    if (type === "entrada") {
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    }
    return <ArrowDown className="w-4 h-4 text-red-600" />;
  };

  const getMovementColor = (type: "entrada" | "saida") => {
    if (type === "entrada") {
      return "text-green-600 bg-green-50";
    }
    return "text-red-600 bg-red-50";
  };

  if (movements.length === 0) {
    return (
      <div className="py-8 text-center">
        <Package className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <p className="text-gray-500">Nenhuma movimentação registrada</p>
        <p className="text-sm text-gray-400">
          As movimentações aparecerão aqui quando forem registradas
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Estoque Anterior</TableHead>
            <TableHead>Estoque Atual</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Observação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell className="text-sm">
                {formatDate(movement.createdAt)}
              </TableCell>
              <TableCell>
                <div className="font-medium">{movement.productName}</div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  {getMovementIcon(movement.type)}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementColor(
                      movement.type
                    )}`}
                  >
                    {movement.type === "entrada" ? "Entrada" : "Saída"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{movement.quantity}</TableCell>
              <TableCell className="text-gray-600">
                {movement.previousQuantity}
              </TableCell>
              <TableCell className="font-medium">
                {movement.newQuantity}
              </TableCell>
              <TableCell>
                <div className="max-w-xs text-sm">{movement.reason}</div>
              </TableCell>
              <TableCell>
                {movement.observation && (
                  <div className="max-w-xs text-sm text-gray-500">
                    {movement.observation}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
