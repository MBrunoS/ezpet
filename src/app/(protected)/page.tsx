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
import { Plus, Users, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { user } = useAuth();
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
      <div className="flex flex-wrap gap-3 justify-between p-4 mb-12">
        <p className="text-text tracking-light text-[32px] font-bold leading-tight min-w-72">
          Bem-vindo{user?.displayName ? `, ${user?.displayName}` : ""}!
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="flex gap-2 items-center px-6 py-3">
            <Users className="w-4 h-4" />
            <span>Cadastrar Cliente</span>
          </Button>
          <Button className="flex gap-2 items-center px-6 py-3">
            <CalendarIcon className="w-4 h-4" />
            <span>Novo Agendamento</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-6 lg:flex-row">
        {/* Left Column - Info Cards */}
        <div className="flex flex-col gap-6 lg:w-1/3">
          <div>
            <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
              Informações Gerais
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Total de Clientes
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {clients?.length || 0}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Agendamentos Futuros
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {upcomingAppointments.length}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Produtos com Estoque Baixo
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {lowStockProducts?.length || 0}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Total de Pets
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {pets?.length || 0}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Serviços Disponíveis
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {services?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Calendar */}
        <div className="flex flex-col gap-4 lg:w-2/3">
          <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em]">
            Calendário de Agendamentos
          </h2>
          <div className="bg-white rounded-lg border border-border">
            <Calendar
              appointments={appointments || []}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onAppointmentClick={handleAppointmentClick}
            />
          </div>
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
