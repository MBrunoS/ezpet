"use client";

import { useState } from "react";
import { useClients } from "@/hooks/queries/useClientsQuery";
import { useAppointments } from "@/hooks/queries/useAppointmentsQuery";
import { useLowStockProducts } from "@/hooks/queries/useStockQuery";
import { usePets } from "@/hooks/queries/usePetsQuery";
import { useServices } from "@/hooks/queries/useServicesQuery";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { AppointmentDetailsDialog } from "@/components/ui/appointment-details-dialog";
import { AppointmentForm } from "@/app/(protected)/appointments/components/AppointmentForm";
import { DeleteConfirmationDialog } from "@/app/(protected)/appointments/components/DeleteConfirmationDialog";
import { useAppointmentActions } from "@/hooks/useAppointmentActions";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: appointments, isLoading: appointmentsLoading } =
    useAppointments();
  const { data: pets, isLoading: petsLoading } = usePets();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: lowStockProducts, isLoading: stockLoading } =
    useLowStockProducts();

  const {
    selectedAppointment,
    isDetailsDialogOpen,
    isFormDialogOpen,
    appointmentToDelete,
    setAppointmentToDelete,
    handleAppointmentClick,
    handleEditAppointment,
    handleDeleteAppointment,
    handleFormSubmit,
    handleConfirmDelete,
    closeDetailsDialog,
    closeFormDialog,
  } = useAppointmentActions({
    clients,
    pets,
    services,
  });

  // Filtrar agendamentos futuros
  const upcomingAppointments =
    appointments
      ?.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        return appointmentDate >= today;
      })
      .slice(0, 5) || [];

  const isLoading =
    clientsLoading ||
    appointmentsLoading ||
    stockLoading ||
    petsLoading ||
    servicesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Dashboard Header */}
      <div className="flex flex-wrap gap-3 justify-between p-4">
        <p className="text-text tracking-light text-[32px] font-bold leading-tight min-w-72">
          Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Total de Clientes
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            {clients?.length || 0}
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Agendamentos Futuros
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            {upcomingAppointments.length}
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Produtos com Estoque Baixo
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            {lowStockProducts?.length || 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Ações Rápidas
      </h2>
      <div className="flex justify-stretch">
        <div className="flex flex-wrap flex-1 gap-3 justify-start px-4 py-3">
          <Button>
            <span className="truncate">Cadastrar Cliente</span>
          </Button>
          <Button>
            <span className="truncate">Novo Agendamento</span>
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Calendário de Agendamentos
      </h2>
      <div className="px-4 py-3">
        <Calendar
          appointments={appointments || []}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onAppointmentClick={handleAppointmentClick}
        />
      </div>

      {/* Finance Overview */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Visão Geral Financeira
      </h2>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Receita Total
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            R$ 15.000
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Despesas
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            R$ 3.000
          </p>
        </div>
      </div>

      {/* Dialogs */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
      />

      <AppointmentForm
        isOpen={isFormDialogOpen}
        onClose={closeFormDialog}
        onSubmit={handleFormSubmit}
        appointmentInEdit={selectedAppointment}
        clients={clients || []}
        pets={pets || []}
        loadingPets={petsLoading}
      />

      <DeleteConfirmationDialog
        appointment={appointmentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAppointmentToDelete(null)}
      />
    </div>
  );
}
