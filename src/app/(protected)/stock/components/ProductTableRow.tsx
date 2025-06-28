"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTableRow({
  product,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const getStatusColor = (quantity: number, minStock: number) => {
    if (quantity <= minStock) {
      return "bg-red-100 text-red-800";
    } else if (quantity <= minStock * 2) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  const getStatusText = (quantity: number, minStock: number) => {
    if (quantity <= minStock) {
      return "Baixo";
    } else if (quantity <= minStock * 2) {
      return "Médio";
    } else {
      return "OK";
    }
  };

  const getQuantityColor = (quantity: number, minStock: number) => {
    return quantity <= minStock ? "text-red-600" : "text-green-600";
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{product.name}</div>
          {product.description && (
            <div className="max-w-xs text-sm text-gray-500 truncate">
              {product.description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{formatCurrency(product.price)}</TableCell>
      <TableCell>
        <span
          className={`font-medium ${getQuantityColor(
            product.quantity,
            product.minStock
          )}`}
        >
          {product.quantity}
        </span>
      </TableCell>
      <TableCell>{product.minStock}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            product.quantity,
            product.minStock
          )}`}
        >
          {getStatusText(product.quantity, product.minStock)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end items-center">
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
