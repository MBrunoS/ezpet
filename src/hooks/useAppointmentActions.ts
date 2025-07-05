import { useState } from "react";
import { useUpdateAppointment, useDeleteAppointment } from "@/hooks/queries/useAppointmentsQuery";
import { Appointment, Client, Pet, Service } from "@/types";
import { AppointmentFormData } from "@/app/dashboard/appointments/schema";
import { toast } from "sonner";

interface UseAppointmentActionsProps {
  clients?: Client[];
  pets?: Pet[];
  services?: Service[];
}

export function useAppointmentActions({ 
  clients = [], 
  pets = [], 
  services = [] 
}: UseAppointmentActionsProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  
  const updateAppointmentMutation = useUpdateAppointment();
  const deleteAppointmentMutation = useDeleteAppointment();

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(false);
    setIsFormDialogOpen(true);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setIsDetailsDialogOpen(false);
  };

  const handleFormSubmit = async (data: AppointmentFormData) => {
    if (!selectedAppointment) return;

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
      (sum: number, extra: any) => sum + extra.price,
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
      status: selectedAppointment.status,
    };

    updateAppointmentMutation.mutate(
      { id: selectedAppointment.id, data: appointmentData },
      {
        onSuccess: () => {
          toast.success("Agendamento atualizado com sucesso!");
          setIsFormDialogOpen(false);
          setSelectedAppointment(null);
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      deleteAppointmentMutation.mutate(appointmentToDelete.id, {
        onSuccess: () => {
          toast.success("Agendamento excluído com sucesso!");
          setAppointmentToDelete(null);
        },
      });
    }
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setSelectedAppointment(null);
  };

  const openNewForm = () => {
    setSelectedAppointment(null);
    setIsFormDialogOpen(true);
  };

  const closeNewForm = () => {
    setIsFormDialogOpen(false);
    setSelectedAppointment(null);
  };

  return {
    // State
    selectedAppointment,
    isDetailsDialogOpen,
    isFormDialogOpen,
    appointmentToDelete,
    setAppointmentToDelete,
    
    // Handlers
    handleAppointmentClick,
    handleEditAppointment,
    handleDeleteAppointment,
    handleFormSubmit,
    handleConfirmDelete,
    
    // Dialog controls
    closeDetailsDialog,
    closeFormDialog,
    openNewForm,
    closeNewForm,
  };
} 