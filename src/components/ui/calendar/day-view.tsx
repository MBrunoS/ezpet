import React from "react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { AppointmentCard } from "./appointment-card";
import { Appointment } from "@/types";

interface DayViewProps {
  currentDate: Date;
  appointmentsWithDetails: Array<{
    appointment: Appointment;
    client?: { name: string };
    pet?: { name: string };
    service?: { name: string };
  }>;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function DayView({
  currentDate,
  appointmentsWithDetails,
  onAppointmentClick,
}: DayViewProps) {
  const isCurrentDay = isToday(currentDate);

  return (
    <div className="p-4">
      <div
        className={`text-lg font-medium mb-4 ${
          isCurrentDay ? "text-primary" : ""
        }`}
      >
        {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
          locale: ptBR,
        })}
      </div>

      <div className="space-y-2">
        {appointmentsWithDetails.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarIcon className="mx-auto w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum agendamento para este dia</p>
          </div>
        ) : (
          appointmentsWithDetails.map(
            ({ appointment, client, pet, service }) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                clientName={client?.name}
                petName={pet?.name}
                serviceName={service?.name}
                onClick={() => onAppointmentClick?.(appointment)}
                variant="detailed"
                showPrice={true}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
