import React from "react";
import {
  format,
  startOfWeek,
  eachDayOfInterval,
  addDays,
  isSameDay,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentCard } from "./appointment-card";
import { Appointment } from "@/types";

interface WeekViewProps {
  currentDate: Date;
  appointmentsWithDetails: Array<{
    appointment: Appointment;
    client?: { name: string };
    pet?: { name: string };
    service?: { name: string };
  }>;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function WeekView({
  currentDate,
  appointmentsWithDetails,
  onAppointmentClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { locale: ptBR });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  const getAppointmentsForDay = (date: Date) => {
    return appointmentsWithDetails
      .filter(({ appointment }) => isSameDay(new Date(appointment.date), date))
      .sort(
        (a, b) =>
          new Date(a.appointment.date).getTime() -
          new Date(b.appointment.date).getTime()
      );
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-border">
      {/* Weekday Headers */}
      {weekDays.map((day) => (
        <div
          key={day.toISOString()}
          className="p-2 text-sm font-medium text-center bg-background text-muted-foreground"
        >
          <div>{format(day, "EEE", { locale: ptBR })}</div>
          <div className="text-xs">{format(day, "dd/MM")}</div>
        </div>
      ))}

      {/* Week Days */}
      {weekDays.map((day) => {
        const dayAppointments = getAppointmentsForDay(day);
        const isCurrentDay = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className={`min-h-[200px] bg-background p-2 ${
              isCurrentDay ? "bg-blue-50" : ""
            }`}
          >
            <div
              className={`text-sm font-medium mb-2 ${
                isCurrentDay
                  ? "flex justify-center items-center w-6 h-6 rounded-full bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {format(day, "d")}
            </div>

            {/* Appointments for this day */}
            <div className="space-y-1">
              {dayAppointments.map(({ appointment, client, pet }) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  clientName={client?.name}
                  petName={pet?.name}
                  onClick={() => onAppointmentClick?.(appointment)}
                  variant="compact"
                />
              ))}

              {dayAppointments.length === 0 && (
                <div className="text-xs text-center text-muted-foreground py-2">
                  Nenhum agendamento
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
