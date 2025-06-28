"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, Users, PawPrint } from "lucide-react";
import { Appointment } from "@/types";

interface DeleteConfirmationDialogProps {
  appointment: Appointment | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  appointment,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Dialog open={!!appointment} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este agendamento? Esta ação não pode
            ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {appointment && (
          <div className="py-4 space-y-4">
            <div className="flex gap-2 items-center">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Cliente:</span>
              <span>{appointment.clientName}</span>
            </div>

            <div className="flex gap-2 items-center">
              <PawPrint className="w-4 h-4 text-green-600" />
              <span className="font-medium">Pet:</span>
              <span>{appointment.petName}</span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="font-medium">Serviço:</span>
              <span>{appointment.serviceName}</span>
            </div>

            <div className="flex gap-2 items-center">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Data:</span>
              <span>{formatDate(appointment.date)}</span>
            </div>

            <div className="flex gap-2 items-center">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Horário:</span>
              <span>{formatTime(appointment.date)}</span>
            </div>
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
