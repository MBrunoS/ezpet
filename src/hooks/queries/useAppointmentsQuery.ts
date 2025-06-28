import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Appointment, Service } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { serviceKeys } from './useServicesQuery';

// Query Keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (userId: string) => [...appointmentKeys.lists(), userId] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  byDate: (date: Date) => [...appointmentKeys.all, 'date', date.toISOString().split('T')[0]] as const,
};

const DEFAULT_SERVICE_DURATION = 30;

// Fetch function
const fetchAppointments = async (userId: string): Promise<Appointment[]> => {
  const appointmentsRef = collection(db, 'appointments');
  const q = query(
    appointmentsRef, 
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate() || new Date(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Appointment[];
};

// Query hook
export function useAppointments() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: appointmentKeys.list(user?.uid || ''),
    queryFn: () => fetchAppointments(user!.uid),
    enabled: !!user,
  });
}

// Query hook for appointments by date
export function useAppointmentsByDate(date: Date) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: appointmentKeys.byDate(date),
    queryFn: async () => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('userId', '==', user!.uid),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        orderBy('date', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Appointment[];
    },
    enabled: !!user,
  });
}

// Mutations
export function useAddAppointment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (appointment: Omit<Appointment, 'id' | 'userId'>) => {
      // Verificar disponibilidade antes de criar
      const isAvailable = await checkTimeSlotAvailability(appointment.date, appointment.serviceId, user!.uid);
      if (!isAvailable) {
        throw new Error('Este horário já está ocupado');
      }

      const newAppointment = {
        ...appointment,
        userId: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'scheduled'
      };
      return addDoc(collection(db, 'appointments'), newAppointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Agendamento criado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar agendamento');
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
      // Se estiver atualizando a data/hora, verificar disponibilidade
      if (data.date && data.serviceId) {
        const isAvailable = await checkTimeSlotAvailability(data.date, data.serviceId, user!.uid, id);
        if (!isAvailable) {
          throw new Error('Este horário já está ocupado');
        }
      }

      const appointmentRef = doc(db, 'appointments', id);
      return updateDoc(appointmentRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Agendamento atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar agendamento');
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteDoc(doc(db, 'appointments', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success('Agendamento excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir agendamento');
    },
  });
}

// Utility function to check time slot availability
async function checkTimeSlotAvailability(
  date: Date, 
  serviceId: string,
  userId: string,
  excludeId?: string
): Promise<boolean> {
  try {
    // Buscar a duração do serviço
    const servicesRef = collection(db, 'services');
    const serviceQuery = query(servicesRef, where('id', '==', serviceId));
    const serviceSnapshot = await getDocs(serviceQuery);
    const service = serviceSnapshot.docs[0]?.data() as Service;
    const serviceDuration = service?.duration || DEFAULT_SERVICE_DURATION;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('userId', '==', userId),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      where('status', '!=', 'canceled')
    );

    const snapshot = await getDocs(q);
    
    // Se não há agendamentos na data, permitir
    if (snapshot.empty) {
      return true;
    }

    const appointmentsWithConflict = snapshot.docs.filter(doc => {
      const appointment = doc.data();
      const appointmentDate = appointment.date.toDate();
      
      // Buscar a duração do serviço do agendamento existente
      const existingServiceId = appointment.serviceId;
      const existingServiceDuration = DEFAULT_SERVICE_DURATION; // TODO: Buscar duração real
      
      const existingStart = appointmentDate.getTime();
      const existingEnd = existingStart + (existingServiceDuration * 60 * 1000);
      
      // Calcular o período do novo agendamento
      const newStart = date.getTime();
      const newEnd = newStart + (serviceDuration * 60 * 1000);
      
      // Verificar se há sobreposição
      const hasOverlap = (newStart < existingEnd && newEnd > existingStart);
      
      return hasOverlap && doc.id !== excludeId;
    });

    return appointmentsWithConflict.length === 0;
  } catch (err) {
    console.error('Erro ao verificar disponibilidade:', err);
    return false;
  }
} 