"use client";

import React, { useState } from "react";
import {
  isSameMonth,
  isSameWeek,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/types";
import { useAppointmentsDetails } from "@/hooks/useAppointmentDetails";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";

type ViewMode = "month" | "week" | "day";

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
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const { appointmentsWithDetails, isLoading } =
    useAppointmentsDetails(appointments);

  const handlePreviousPeriod = () => {
    switch (viewMode) {
      case "month":
        onDateChange(subMonths(currentDate, 1));
        break;
      case "week":
        onDateChange(addDays(currentDate, -7));
        break;
      case "day":
        onDateChange(addDays(currentDate, -1));
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (viewMode) {
      case "month":
        onDateChange(addMonths(currentDate, 1));
        break;
      case "week":
        onDateChange(addDays(currentDate, 7));
        break;
      case "day":
        onDateChange(addDays(currentDate, 1));
        break;
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getAppointmentsForPeriod = () => {
    switch (viewMode) {
      case "month":
        return appointmentsWithDetails
          .filter(({ appointment }) =>
            isSameMonth(new Date(appointment.date), currentDate)
          )
          .sort(
            (a, b) =>
              new Date(a.appointment.date).getTime() -
              new Date(b.appointment.date).getTime()
          );

      case "week":
        return appointmentsWithDetails
          .filter(({ appointment }) =>
            isSameWeek(new Date(appointment.date), currentDate, {
              locale: ptBR,
            })
          )
          .sort(
            (a, b) =>
              new Date(a.appointment.date).getTime() -
              new Date(b.appointment.date).getTime()
          );

      case "day":
        return appointmentsWithDetails
          .filter(({ appointment }) =>
            isSameDay(new Date(appointment.date), currentDate)
          )
          .sort(
            (a, b) =>
              new Date(a.appointment.date).getTime() -
              new Date(b.appointment.date).getTime()
          );
    }
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
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPreviousPeriod={handlePreviousPeriod}
        onNextPeriod={handleNextPeriod}
        onToday={handleToday}
        onViewModeChange={setViewMode}
      />

      {/* Calendar Content */}
      {viewMode === "month" && (
        <MonthView
          currentDate={currentDate}
          appointmentsWithDetails={appointmentsWithDetails}
          onAppointmentClick={onAppointmentClick}
        />
      )}
      {viewMode === "week" && (
        <WeekView
          currentDate={currentDate}
          appointmentsWithDetails={appointmentsWithDetails}
          onAppointmentClick={onAppointmentClick}
        />
      )}
      {viewMode === "day" && (
        <DayView
          currentDate={currentDate}
          appointmentsWithDetails={getAppointmentsForPeriod()}
          onAppointmentClick={onAppointmentClick}
        />
      )}
    </div>
  );
}
