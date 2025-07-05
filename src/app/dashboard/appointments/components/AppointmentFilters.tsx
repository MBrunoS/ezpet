"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";

interface AppointmentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  timeFilter: string;
  onTimeFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export function AppointmentFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  timeFilter,
  onTimeFilterChange,
  onClearFilters,
}: AppointmentFiltersProps) {
  const hasActiveFilters =
    searchTerm || statusFilter !== "all" || dateFilter || timeFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            placeholder="Pesquisar por cliente ou pet..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="scheduled">Agendado</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="canceled">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative w-48">
          <CalendarIcon className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={timeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por horário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os horários</SelectItem>
            <SelectItem value="morning">Manhã (06:00 - 12:00)</SelectItem>
            <SelectItem value="afternoon">Tarde (12:00 - 18:00)</SelectItem>
            <SelectItem value="evening">Noite (18:00 - 23:59)</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex gap-2 items-center"
          >
            <X className="w-4 h-4" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
