"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, DollarSign, Plus } from "lucide-react";
import { ServiceExtra } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ServiceExtrasProps {
  extras: ServiceExtra[];
  onExtrasChange: (extras: ServiceExtra[]) => void;
  onAddExtra: () => void;
  onEditExtra: (extra: ServiceExtra) => void;
}

export function ServiceExtras({
  extras,
  onExtrasChange,
  onAddExtra,
  onEditExtra,
}: ServiceExtrasProps) {
  const handleDelete = (extraId: string) => {
    const updatedExtras = extras.filter((extra) => extra.id !== extraId);
    onExtrasChange(updatedExtras);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Extras do Serviço</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddExtra}
          className="flex gap-2 items-center"
        >
          <Plus className="w-4 h-4" />
          Adicionar Extra
        </Button>
      </div>

      {extras.length === 0 ? (
        <div className="py-4 text-sm text-center text-gray-500">
          Nenhum extra cadastrado
        </div>
      ) : (
        <div className="space-y-2">
          {extras.map((extra) => (
            <div
              key={extra.id}
              className="flex justify-between items-center p-3 rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <span className="font-medium">{extra.name}</span>
                  <Badge
                    variant="secondary"
                    className="flex gap-1 items-center"
                  >
                    <DollarSign className="w-3 h-3" />
                    {formatCurrency(extra.price)}
                  </Badge>
                </div>
                {extra.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {extra.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEditExtra(extra)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(extra.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
