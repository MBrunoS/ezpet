"use client";

import React, { useState } from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { useClients } from "../../hooks/useClients";
import { usePets } from "../../hooks/usePets";
import { Appointment, Client, Pet } from "../../types";
import { Button } from "../../components/ui/button";
import { Plus, Calendar, Clock } from "lucide-react";
import {
  AppointmentForm,
  AppointmentTable,
  DeleteConfirmationDialog,
} from "./components";
import { AppointmentFormData } from "./schema";

export default function AppointmentsPage() {
  const {
    appointments,
    loading: loadingAppointments,
    error: errorAppointments,
    addAppointment,
    updateAppointment,
    removeAppointment,
    checkTimeSlotAvailability,
  } = useAppointments();

  const {
    clients,
    loading: loadingClients,
    error: errorClients,
  } = useClients();

  const {
    loading: loadingPets,
    error: errorPets,
    loadPetsByClient,
  } = usePets();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointmentInEdit, setAppointmentInEdit] =
    useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientPets, setClientPets] = useState<Pet[]>([]);

  const handleSubmit = async (data: AppointmentFormData) => {
    if (!selectedClient) return;

    const selectedPet = clientPets.find((pet) => pet.id === data.petId);
    if (!selectedPet) return;

    const appointmentDate = new Date(`${data.date}T${data.time}`);

    const appointmentData: Omit<Appointment, "id"> = {
      clientId: data.clientId,
      petId: data.petId,
      serviceName: data.serviceType,
      service: data.serviceType,
      clientName: selectedClient.name,
      petName: selectedPet.name,
      date: appointmentDate,
      price: 0, // Pode ser implementado um sistema de preços depois
      observations: data.observations || "",
      status: "scheduled",
    };

    if (appointmentInEdit) {
      const success = await updateAppointment(
        appointmentInEdit.id,
        appointmentData
      );
      if (success) {
        setIsDialogOpen(false);
        setAppointmentInEdit(null);
        setSelectedClient(null);
        setClientPets([]);
      }
    } else {
      const success = await addAppointment(appointmentData);
      if (success) {
        setIsDialogOpen(false);
        setSelectedClient(null);
        setClientPets([]);
      }
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setAppointmentInEdit(appointment);
    // Buscar cliente e pets para preencher o formulário
    const client = clients.find((c) => c.id === appointment.clientId);
    if (client) {
      setSelectedClient(client);
      loadClientPets(client.id);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (appointmentToDelete) {
      await removeAppointment(appointmentToDelete.id);
      setAppointmentToDelete(null);
    }
  };

  const handleClientChange = async (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setSelectedClient(client || null);
    if (client) {
      await loadClientPets(client.id);
    } else {
      setClientPets([]);
    }
  };

  const loadClientPets = async (clientId: string) => {
    const pets = await loadPetsByClient(clientId);
    setClientPets(pets);
  };

  const openNewDialog = () => {
    setAppointmentInEdit(null);
    setSelectedClient(null);
    setClientPets([]);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setAppointmentInEdit(null);
    setSelectedClient(null);
    setClientPets([]);
  };

  const loading = loadingAppointments || loadingClients || loadingPets;
  const error = errorAppointments || errorClients || errorPets;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando agendamentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Erro: {error}</div>
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
              Agendamentos ({appointments.length})
            </h2>
          </div>

          <AppointmentTable
            appointments={appointments}
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
        clients={clients}
        clientPets={clientPets}
        onClientChange={handleClientChange}
        selectedClient={selectedClient}
        checkTimeSlotAvailability={checkTimeSlotAvailability}
      />

      <DeleteConfirmationDialog
        appointment={appointmentToDelete}
        onConfirm={handleDelete}
        onCancel={() => setAppointmentToDelete(null)}
      />
    </div>
  );
}
