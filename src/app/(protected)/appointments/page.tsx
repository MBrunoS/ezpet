"use client";

import React, { useState } from "react";
import {
  useAppointments,
  useAddAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/queries/useAppointmentsQuery";
import { useClients } from "@/hooks/queries/useClientsQuery";
import { usePets } from "@/hooks/queries/usePetsQuery";
import { useServices } from "@/hooks/queries/useServicesQuery";
import { Appointment } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { AppointmentForm } from "./components/AppointmentForm";
import { AppointmentTable } from "./components/AppointmentTable";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { AppointmentFormData } from "./schema";
import { toast } from "sonner";

export default function AppointmentsPage() {
  const { data: appointments, isLoading: loadingAppointments } =
    useAppointments();
  const addAppointmentMutation = useAddAppointment();
  const updateAppointmentMutation = useUpdateAppointment();
  const deleteAppointmentMutation = useDeleteAppointment();

  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: pets, isLoading: loadingPets } = usePets();
  const { data: services, isLoading: loadingServices } = useServices();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointmentInEdit, setAppointmentInEdit] =
    useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);

  const handleSubmit = async (data: AppointmentFormData) => {
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
      serviceName: service.name,
      service: service.name, // Mantendo compatibilidade
      clientName: client.name,
      petName: pet.name,
      date: data.date,
      price: totalPrice,
      selectedExtras: data.selectedExtras || [],
      observations: data.observations,
      status: "scheduled" as const,
    };

    if (appointmentInEdit) {
      updateAppointmentMutation.mutate(
        { id: appointmentInEdit.id, data: appointmentData },
        {
          onSuccess: () => {
            toast.success("Agendamento atualizado com sucesso!");
            setIsDialogOpen(false);
            setAppointmentInEdit(null);
          },
        }
      );
    } else {
      addAppointmentMutation.mutate(appointmentData, {
        onSuccess: () => {
          toast.success("Agendamento cadastrado com sucesso!");
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setAppointmentInEdit(appointment);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (appointmentToDelete) {
      deleteAppointmentMutation.mutate(appointmentToDelete.id, {
        onSuccess: () => {
          toast.success("Agendamento excluído com sucesso!");
          setAppointmentToDelete(null);
        },
      });
    }
  };

  const openNewDialog = () => {
    setAppointmentInEdit(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setAppointmentInEdit(null);
  };

  const loading =
    loadingAppointments || loadingClients || loadingPets || loadingServices;

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
        <Button onClick={openNewDialog} className="flex gap-2 items-center">
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
            onDelete={setAppointmentToDelete}
          />
        </div>
      </div>

      <AppointmentForm
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        appointmentInEdit={appointmentInEdit}
        clients={clients || []}
        pets={pets || []}
        loadingPets={loadingPets}
      />

      <DeleteConfirmationDialog
        appointment={appointmentToDelete}
        onConfirm={handleDelete}
        onCancel={() => setAppointmentToDelete(null)}
      />
    </div>
  );
}
