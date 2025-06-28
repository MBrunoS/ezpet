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
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  PawPrint,
  DollarSign,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { Appointment } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAppointmentDetails } from "@/hooks/useAppointmentDetails";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
}

export function AppointmentDetailsDialog({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: AppointmentDetailsDialogProps) {
  const { client, pet, service, isLoading } =
    useAppointmentDetails(appointment);

  if (!appointment) return null;

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR });
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="default">Agendado</Badge>;
      case "completed":
        return <Badge variant="secondary">Concluído</Badge>;
      case "canceled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex justify-center items-center py-8">
            <div className="text-lg">Carregando detalhes...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Calendar className="w-5 h-5" />
            Detalhes do Agendamento
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre o agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge(appointment.status)}
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Cliente:</span>
            </div>
            <p className="pl-6 text-sm text-gray-700">
              {client?.name || "Cliente não encontrado"}
            </p>
          </div>

          {/* Pet */}
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <PawPrint className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Pet:</span>
            </div>
            <p className="pl-6 text-sm text-gray-700">
              {pet?.name || "Pet não encontrado"}
            </p>
          </div>

          {/* Serviço */}
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Serviço:</span>
            </div>
            <p className="pl-6 text-sm text-gray-700">
              {service?.name || "Serviço não encontrado"}
            </p>
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Data:</span>
              </div>
              <p className="pl-6 text-sm text-gray-700">
                {formatDate(appointment.date)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Horário:</span>
              </div>
              <p className="pl-6 text-sm text-gray-700">
                {formatTime(appointment.date)}
              </p>
            </div>
          </div>

          {/* Preço */}
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Preço Total:</span>
            </div>
            <p className="pl-6 text-lg font-semibold text-green-600">
              {formatCurrency(appointment.price)}
            </p>
          </div>

          {/* Extras */}
          {appointment.selectedExtras &&
            appointment.selectedExtras.length > 0 && (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium">
                    Extras Selecionados:
                  </span>
                </div>
                <div className="pl-6 space-y-1">
                  {appointment.selectedExtras.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-700">{extra.name}</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(extra.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Observações */}
          {appointment.observations && (
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Observações:</span>
              </div>
              <p className="p-3 pl-6 text-sm text-gray-700 bg-gray-50 rounded-md">
                {appointment.observations}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(appointment)}
              className="flex gap-2 items-center"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={() => onDelete(appointment)}
              className="flex gap-2 items-center"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
