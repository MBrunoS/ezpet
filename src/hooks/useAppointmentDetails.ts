import { useMemo } from 'react';
import { useClients } from '@/hooks/queries/useClientsQuery';
import { usePets } from '@/hooks/queries/usePetsQuery';
import { useServices } from '@/hooks/queries/useServicesQuery';
import { Appointment, Client, Pet, Service } from '@/types';

interface AppointmentDetails {
  appointment: Appointment | null;
  client: Client | undefined;
  pet: Pet | undefined;
  service: Service | undefined;
  isLoading: boolean;
}

export function useAppointmentDetails(appointment: Appointment | null): AppointmentDetails {
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: pets, isLoading: loadingPets } = usePets();
  const { data: services, isLoading: loadingServices } = useServices();

  const client = useMemo(() => {
    if (!appointment) return undefined;
    return clients?.find(c => c.id === appointment.clientId);
  }, [clients, appointment?.clientId]);

  const pet = useMemo(() => {
    if (!appointment) return undefined;
    return pets?.find(p => p.id === appointment.petId);
  }, [pets, appointment?.petId]);

  const service = useMemo(() => {
    if (!appointment) return undefined;
    return services?.find(s => s.id === appointment.serviceId);
  }, [services, appointment?.serviceId]);

  const isLoading = loadingClients || loadingPets || loadingServices;

  return {
    appointment,
    client,
    pet,
    service,
    isLoading,
  };
}

// Hook para múltiplos appointments
export function useAppointmentsDetails(appointments: Appointment[]) {
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: pets, isLoading: loadingPets } = usePets();
  const { data: services, isLoading: loadingServices } = useServices();

  const appointmentsWithDetails = useMemo(() => {
    return appointments.map(appointment => {
      const client = clients?.find(c => c.id === appointment.clientId);
      const pet = pets?.find(p => p.id === appointment.petId);
      const service = services?.find(s => s.id === appointment.serviceId);

      return {
        appointment,
        client,
        pet,
        service,
      };
    });
  }, [appointments, clients, pets, services]);

  const isLoading = loadingClients || loadingPets || loadingServices;

  return {
    appointmentsWithDetails,
    isLoading,
  };
} 