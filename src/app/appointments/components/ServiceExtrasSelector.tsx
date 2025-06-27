"use client";

import React, { useRef } from "react";
import { Checkbox } from "../../../components/ui/checkbox";
import { Badge } from "../../../components/ui/badge";
import { DollarSign } from "lucide-react";
import { ServiceExtra } from "../../../types";
import { formatCurrency } from "@/lib/utils";

interface ServiceExtrasSelectorProps {
  extras: ServiceExtra[];
  selectedExtras: ServiceExtra[];
  onExtrasChange: (extras: ServiceExtra[]) => void;
  disabled?: boolean;
}

export function ServiceExtrasSelector({
  extras,
  selectedExtras,
  onExtrasChange,
  disabled = false,
}: ServiceExtrasSelectorProps) {
  // Garantir que selectedExtras seja sempre um array
  const safeSelectedExtras = selectedExtras || [];

  const handleExtraToggle = (extra: ServiceExtra, checked: boolean) => {
    if (checked) {
      onExtrasChange([...safeSelectedExtras, extra]);
    } else {
      onExtrasChange(safeSelectedExtras.filter((e) => e.id !== extra.id));
    }
  };

  if (extras.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Este serviço não possui extras disponíveis
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {extras.map((extra) => {
          const isSelected = safeSelectedExtras.some((e) => e.id === extra.id);
          return (
            <div
              key={extra.id}
              className="flex items-center p-3 space-x-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50"
            >
              <Checkbox
                id={extra.id}
                checked={isSelected}
                onCheckedChange={(checked: boolean) =>
                  handleExtraToggle(extra, checked)
                }
                disabled={disabled}
              />
              <div className="flex-1">
                <span className="text-sm font-medium">{extra.name}</span>
                {extra.description && (
                  <p className="mt-1 text-xs text-gray-600">
                    {extra.description}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="flex gap-1 items-center">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(extra.price)}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
