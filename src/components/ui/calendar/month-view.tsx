import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { AppointmentCard } from "./appointment-card";
import { Appointment } from "@/types";

interface MonthViewProps {
  currentDate: Date;
  appointmentsWithDetails: Array<{
    appointment: Appointment;
    client?: { name: string };
    pet?: { name: string };
    service?: { name: string };
  }>;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function MonthView({
  currentDate,
  appointmentsWithDetails,
  onAppointmentClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Adicionar dias do mês anterior para completar a primeira semana
  const firstDayOfWeek = monthStart.getDay();
  const daysFromPrevMonth = Array.from({ length: firstDayOfWeek }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (firstDayOfWeek - i));
    return date;
  });

  // Adicionar dias do próximo mês para completar a última semana
  const lastDayOfWeek = monthEnd.getDay();
  const daysFromNextMonth = Array.from(
    { length: 6 - lastDayOfWeek },
    (_, i) => {
      const date = new Date(monthEnd);
      date.setDate(date.getDate() + i + 1);
      return date;
    }
  );

  const allDays = [...daysFromPrevMonth, ...days, ...daysFromNextMonth];

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
      {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
        <div
          key={day}
          className="p-2 text-sm font-medium text-center bg-background text-muted-foreground"
        >
          {day}
        </div>
      ))}

      {/* Calendar Days */}
      {allDays.map((day, index) => {
        const dayAppointments = getAppointmentsForDay(day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isCurrentDay = isToday(day);

        return (
          <div
            key={index}
            className={`min-h-[120px] bg-background p-2 ${
              !isCurrentMonth ? "text-muted-foreground/50" : ""
            }`}
          >
            <div
              className={`text-sm font-medium mb-1 ${
                isCurrentDay
                  ? "flex justify-center items-center w-6 h-6 rounded-full bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {format(day, "d")}
            </div>

            {/* Appointments for this day */}
            <div className="space-y-1">
              {dayAppointments
                .slice(0, 3)
                .map(({ appointment, client, pet }) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    clientName={client?.name}
                    petName={pet?.name}
                    onClick={() => onAppointmentClick?.(appointment)}
                    variant="compact"
                  />
                ))}

              {dayAppointments.length > 3 && (
                <div className="text-xs text-center text-muted-foreground">
                  +{dayAppointments.length - 3} mais
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
