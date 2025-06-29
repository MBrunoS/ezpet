import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { startOfWeek, endOfWeek } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "month" | "week" | "day";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onPreviousPeriod,
  onNextPeriod,
  onToday,
  onViewModeChange,
}: CalendarHeaderProps) {
  const getPeriodTitle = () => {
    switch (viewMode) {
      case "month":
        return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
      case "week":
        const weekStart = startOfWeek(currentDate, { locale: ptBR });
        const weekEnd = endOfWeek(currentDate, { locale: ptBR });
        return `${format(weekStart, "dd/MM", { locale: ptBR })} - ${format(
          weekEnd,
          "dd/MM/yyyy",
          { locale: ptBR }
        )}`;
      case "day":
        return format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-border">
      <div className="flex gap-4 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPeriod}
          className="p-0 w-8 h-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">{getPeriodTitle()}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPeriod}
          className="p-0 w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        {/* View Mode Toggle */}
        <div className="flex rounded-md border">
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("month")}
            className="rounded-r-none"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("week")}
            className="rounded-none"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("day")}
            className="rounded-l-none"
          >
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={onToday}>
          Hoje
        </Button>
      </div>
    </div>
  );
}
