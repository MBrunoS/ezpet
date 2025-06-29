import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/types";

interface AppointmentCardProps {
  appointment: Appointment;
  clientName?: string;
  petName?: string;
  serviceName?: string;
  onClick?: () => void;
  variant?: "compact" | "detailed";
  showPrice?: boolean;
}

export function AppointmentCard({
  appointment,
  clientName,
  petName,
  serviceName,
  onClick,
  variant = "compact",
  showPrice = false,
}: AppointmentCardProps) {
  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR });
  };

  const getStatusColor = () => {
    switch (appointment.status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };

  const getStatusText = () => {
    switch (appointment.status) {
      case "completed":
        return "Concluído";
      case "canceled":
        return "Cancelado";
      default:
        return "Agendado";
    }
  };

  if (variant === "detailed") {
    return (
      <div
        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
          appointment.status === "completed"
            ? "bg-green-50 border-green-200 hover:bg-green-100"
            : appointment.status === "canceled"
            ? "bg-red-50 border-red-200 hover:bg-red-100"
            : "bg-blue-50 border-blue-200 hover:bg-blue-100"
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-lg font-semibold">
                {formatTime(appointment.date)}
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === "completed"
                    ? "bg-green-200 text-green-800"
                    : appointment.status === "canceled"
                    ? "bg-red-200 text-red-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {getStatusText()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">Cliente:</span>{" "}
                {clientName || "Cliente não encontrado"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Pet:</span>{" "}
                {petName || "Pet não encontrado"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Serviço:</span>{" "}
                {serviceName || "Serviço não encontrado"}
              </div>
            </div>
          </div>

          {showPrice && (
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">
                R$ {appointment.price.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact variant
  return (
    <div
      className={`text-xs p-1 rounded cursor-pointer transition-colors ${getStatusColor()}`}
      onClick={onClick}
      title={`${clientName || "Cliente não encontrado"} - ${
        petName || "Pet não encontrado"
      } - ${formatTime(appointment.date)}`}
    >
      <div className="font-medium truncate">{formatTime(appointment.date)}</div>
      <div className="truncate">{clientName || "Cliente não encontrado"}</div>
      <div className="text-xs truncate opacity-75">
        {petName || "Pet não encontrado"}
      </div>
    </div>
  );
}
