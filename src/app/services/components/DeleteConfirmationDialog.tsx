"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Settings, DollarSign, Clock } from "lucide-react";
import { Service } from "../../../types";

interface DeleteConfirmationDialogProps {
  service: Service | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  service,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <Dialog open={!!service} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este serviço? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>

        {service && (
          <div className="space-y-4 py-4">
            <div className="flex gap-2 items-center">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Serviço:</span>
              <span>{service.name}</span>
            </div>

            <div className="flex gap-2 items-center">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium">Preço:</span>
              <span>{formatPrice(service.price)}</span>
            </div>

            <div className="flex gap-2 items-center">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Duração:</span>
              <span>{formatDuration(service.duration)}</span>
            </div>

            {service.extras && service.extras.length > 0 && (
              <div className="pt-2 border-t">
                <span className="font-medium">Extras:</span>
                <div className="mt-2 space-y-1">
                  {service.extras.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{extra.name}</span>
                      <span className="text-green-600">
                        +{formatPrice(extra.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.description && (
              <div className="pt-2 border-t">
                <span className="font-medium">Descrição:</span>
                <p className="text-sm text-gray-600 mt-1">
                  {service.description}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
