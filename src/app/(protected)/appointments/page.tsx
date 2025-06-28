"use client";

import React from "react";
import {
  useAppointments,
  useAddAppointment,
} from "@/hooks/queries/useAppointmentsQuery";
import { usePets } from "@/hooks/queries/usePetsQuery";
import { useClients } from "@/hooks/queries/useClientsQuery";
import { useServices } from "@/hooks/queries/useServicesQuery";
import { Appointment } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { AppointmentForm } from "./components/AppointmentForm";
import { AppointmentTable } from "./components/AppointmentTable";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { AppointmentFormData } from "./schema";
import { toast } from "sonner";
import { useAppointmentActions } from "@/hooks/useAppointmentActions";

export default function AppointmentsPage() {
  const { data: appointments, isLoading: loadingAppointments } =
    useAppointments();
  const addAppointmentMutation = useAddAppointment();

  const { data: pets, isLoading: loadingPets } = usePets();
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: services, isLoading: loadingServices } = useServices();

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
    openNewForm,
    closeNewForm,
  } = useAppointmentActions({
    clients,
    pets,
    services,
  });

  const handleCreateAppointment = async (data: AppointmentFormData) => {
    // Buscar informações do cliente, pet e serviço
    const client = clients?.find((c) => c.id === data.clientId);
    const pet = pets?.find((p) => p.id === data.petId);
    const service = services?.find((s) => s.id === data.serviceId);

    if (!client || !pet || !service) {
      toast.error("Dados não encontrados");
      return;
    }

    // Calcular preço total incluindo extras
    const extrasPrice = (data.selectedExtras || []).reduce(
      (sum, extra) => sum + extra.price,
      0
    );
    const totalPrice = service.price + extrasPrice;

    const appointmentData = {
      clientId: data.clientId,
      petId: data.petId,
      serviceId: data.serviceId,
      date: data.date,
      price: totalPrice,
      selectedExtras: data.selectedExtras || [],
      observations: data.observations,
      status: "scheduled" as const,
    };

    addAppointmentMutation.mutate(appointmentData, {
      onSuccess: () => {
        toast.success("Agendamento cadastrado com sucesso!");
        closeNewForm();
      },
    });
  };

  const handleEdit = (appointment: Appointment) => {
    handleEditAppointment(appointment);
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
        <Button onClick={openNewForm} className="flex gap-2 items-center">
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex gap-2 items-center mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              Agendamentos ({appointments?.length || 0})
            </h2>
          </div>

          <AppointmentTable
            appointments={appointments || []}
            onEdit={handleEdit}
            onDelete={handleDeleteAppointment}
          />
        </div>
      </div>

      {/* Form for creating new appointments */}
      <AppointmentForm
        isOpen={isFormDialogOpen && !selectedAppointment}
        onClose={closeNewForm}
        onSubmit={handleCreateAppointment}
        appointmentInEdit={null}
        clients={clients || []}
        pets={pets || []}
        loadingPets={loadingPets}
      />

      {/* Form for editing existing appointments */}
      <AppointmentForm
        isOpen={isFormDialogOpen && !!selectedAppointment}
        onClose={closeFormDialog}
        onSubmit={handleFormSubmit}
        appointmentInEdit={selectedAppointment}
        clients={clients || []}
        pets={pets || []}
        loadingPets={loadingPets}
      />

      <DeleteConfirmationDialog
        appointment={appointmentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAppointmentToDelete(null)}
      />
    </div>
  );
}
