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
import { AppointmentTable } from "./components/AppointmentTable";
import { toast } from "sonner";
import { useDialog } from "@/contexts/DialogContext";

export default function AppointmentsPage() {
  const { data: appointments, isLoading: loadingAppointments } =
    useAppointments();

  const { data: pets, isLoading: loadingPets } = usePets();
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: services, isLoading: loadingServices } = useServices();

  const { openDialog, closeDialog } = useDialog();

  const handleEdit = (appointment: Appointment) => {
    openDialog("appointment-form", { appointment });
  };

  const handleDelete = (appointment: Appointment) => {
    // A lógica de delete será tratada pelo GlobalDialogs
    // usando o callback onConfirm
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
              Agendamentos ({appointments?.length || 0})
            </h2>
          </div>

          <AppointmentTable
            appointments={appointments || []}
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
