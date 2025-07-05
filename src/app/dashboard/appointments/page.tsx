"use client";

import React, { useState, useMemo } from "react";
import {
  useAppointments,
  useAddAppointment,
  useDeleteAppointment,
} from "@/hooks/queries/useAppointmentsQuery";
import { usePets } from "@/hooks/queries/usePetsQuery";
import { useClients } from "@/hooks/queries/useClientsQuery";
import { useServices } from "@/hooks/queries/useServicesQuery";
import { Appointment } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { AppointmentTable, AppointmentFilters } from "./components";
import { toast } from "sonner";
import { useDialog } from "@/contexts/DialogContext";

export default function AppointmentsPage() {
  const { data: appointments, isLoading: loadingAppointments } =
    useAppointments();
  const deleteAppointmentMutation = useDeleteAppointment();

  const { data: pets, isLoading: loadingPets } = usePets();
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: services, isLoading: loadingServices } = useServices();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const { openDialog, closeDialog } = useDialog();

  // Filtrar agendamentos baseado nos filtros aplicados
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    let filtered = appointments;

    // Filtro por termo de pesquisa (cliente ou pet)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((appointment) => {
        const client = clients?.find((c) => c.id === appointment.clientId);
        const pet = pets?.find((p) => p.id === appointment.petId);

        return (
          client?.name.toLowerCase().includes(searchLower) ||
          pet?.name.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter
      );
    }

    // Filtro por data
    if (dateFilter) {
      // Criar a data considerando timezone local para evitar problemas de UTC
      const [year, month, day] = dateFilter.split("-").map(Number);
      const filterDate = new Date(year, month - 1, day); // month - 1 porque getMonth() retorna 0-11

      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);

        // Comparar apenas ano, mês e dia, ignorando horário e timezone
        const appointmentYear = appointmentDate.getFullYear();
        const appointmentMonth = appointmentDate.getMonth();
        const appointmentDay = appointmentDate.getDate();

        return (
          appointmentYear === filterDate.getFullYear() &&
          appointmentMonth === filterDate.getMonth() &&
          appointmentDay === filterDate.getDate()
        );
      });
    }

    // Filtro por horário
    if (timeFilter !== "all") {
      filtered = filtered.filter((appointment) => {
        const appointmentHour = new Date(appointment.date).getHours();

        switch (timeFilter) {
          case "morning":
            return appointmentHour >= 6 && appointmentHour < 12;
          case "afternoon":
            return appointmentHour >= 12 && appointmentHour < 18;
          case "evening":
            return appointmentHour >= 18 && appointmentHour <= 23;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [
    appointments,
    clients,
    pets,
    searchTerm,
    statusFilter,
    dateFilter,
    timeFilter,
  ]);

  const handleEdit = (appointment: Appointment) => {
    openDialog("appointment-form", { appointment });
  };

  const handleDelete = (appointment: Appointment) => {
    deleteAppointmentMutation.mutate(appointment.id, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
    setTimeFilter("all");
  };

  const loading =
    loadingAppointments || loadingPets || loadingClients || loadingServices;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando agendamentos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie os agendamentos de serviços</p>
        </div>
        <Button
          onClick={() =>
            openDialog("appointment-form", { appointment: undefined })
          }
          className="flex gap-2 items-center"
        >
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex gap-2 items-center mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              Agendamentos ({filteredAppointments.length || 0})
            </h2>
          </div>

          <div className="mb-6">
            <AppointmentFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
              onClearFilters={handleClearFilters}
            />
          </div>

          <AppointmentTable
            appointments={filteredAppointments}
            onEdit={handleEdit}
            onDelete={(appointment) =>
              openDialog("delete-confirmation", {
                id: appointment.id,
                name: `Agendamento ${appointment.id}`,
                type: "agendamento",
                onConfirm: () => handleDelete(appointment),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
