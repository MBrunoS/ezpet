"use client";

import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types";
import { useAppointmentsDetails } from "@/hooks/useAppointmentDetails";

interface CalendarProps {
  appointments: Appointment[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function Calendar({
  appointments,
  currentDate,
  onDateChange,
  onAppointmentClick,
}: CalendarProps) {
  const { appointmentsWithDetails, isLoading } =
    useAppointmentsDetails(appointments);

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
    return appointmentsWithDetails.filter(({ appointment }) =>
      isSameDay(new Date(appointment.date), date)
    );
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR });
  };

  const handlePreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-border">
        <div className="flex justify-center items-center p-8">
          <div className="text-lg">Carregando calendário...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border">
      {/* Calendar Header */}
      <div className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex gap-4 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
            className="p-0 w-8 h-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="p-0 w-8 h-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleToday}>
          Hoje
        </Button>
      </div>

      {/* Calendar Grid */}
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
                    <div
                      key={appointment.id}
                      className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : appointment.status === "canceled"
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                      onClick={() => onAppointmentClick?.(appointment)}
                      title={`${client?.name || "Cliente não encontrado"} - ${
                        pet?.name || "Pet não encontrado"
                      } - ${formatTime(appointment.date)}`}
                    >
                      <div className="font-medium truncate">
                        {formatTime(appointment.date)}
                      </div>
                      <div className="truncate">
                        {client?.name || "Cliente não encontrado"}
                      </div>
                      <div className="text-xs truncate opacity-75">
                        {pet?.name || "Pet não encontrado"}
                      </div>
                    </div>
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
    </div>
  );
}
