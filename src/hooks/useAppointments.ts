import { useState, useEffect, useCallback } from 'react';
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
import { db } from '../lib/firebase';
import { Appointment, Service } from '../types';
import { useAuth } from '@/contexts/AuthContext';

interface AppointmentsState {
  appointments: Appointment[];
  appointmentsToday: Appointment[];
  loading: boolean;
  error: string | null;
}

interface AppointmentsMethods {
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<boolean>;
  updateAppointment: (id: string, updatedData: Partial<Appointment>) => Promise<boolean>;
  removeAppointment: (id: string) => Promise<boolean>;
  loadAppointments: () => Promise<void>;
  checkTimeSlotAvailability: (date: Date, serviceDuration: number, excludeId?: string) => Promise<boolean>;
  getAppointmentsByDate: (date: Date) => Promise<Appointment[]>;
}

export function useAppointments(): AppointmentsState & AppointmentsMethods {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef, 
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Appointment[];
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const checkTimeSlotAvailability = useCallback(async (
    date: Date, 
    serviceDuration: number,
    excludeId?: string
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('userId', '==', user.uid),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        where('status', '!=', 'canceled')
      );

      const snapshot = await getDocs(q);
      const appointmentsWithConflict = snapshot.docs.filter(doc => {
        const appointment = doc.data();
        const appointmentDate = appointment.date.toDate();
        
        // Buscar a duração do serviço do agendamento existente
        // Por enquanto, usar duração padrão de 60 minutos
        // TODO: Implementar busca da duração real do serviço
        const existingServiceDuration = 60;
        
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
  }, [user]);

  const getAppointmentsByDate = useCallback(async (date: Date): Promise<Appointment[]> => {
    if (!user) return [];
    
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('userId', '==', user.uid),
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
    } catch (err) {
      console.error('Erro ao buscar agendamentos por data:', err);
      return [];
    }
  }, [user]);

  const addAppointment = useCallback(async (appointment: Omit<Appointment, 'id'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Por enquanto, usar duração padrão de 60 minutos
      // TODO: Buscar duração real do serviço
      const serviceDuration = 60;
      
      // Verificar se o horário está disponível
      const isAvailable = await checkTimeSlotAvailability(appointment.date, serviceDuration);
      if (!isAvailable) {
        setError('Este horário já está ocupado');
        return false;
      }

      const newAppointment = {
        ...appointment,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'scheduled'
      };
      await addDoc(collection(db, 'appointments'), newAppointment);
      await loadAppointments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [loadAppointments, checkTimeSlotAvailability, user]);

  const updateAppointment = useCallback(async (id: string, updatedData: Partial<Appointment>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Se estiver atualizando a data/hora, verificar disponibilidade
      if (updatedData.date) {
        // Por enquanto, usar duração padrão de 60 minutos
        // TODO: Buscar duração real do serviço
        const serviceDuration = 60;
        
        const isAvailable = await checkTimeSlotAvailability(updatedData.date, serviceDuration, id);
        if (!isAvailable) {
          setError('Este horário já está ocupado');
          return false;
        }
      }

      const appointmentRef = doc(db, 'appointments', id);
      await updateDoc(appointmentRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      await loadAppointments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [loadAppointments, checkTimeSlotAvailability]);

  const removeAppointment = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await deleteDoc(doc(db, 'appointments', id));
      await loadAppointments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [loadAppointments]);

  // Calculate appointments for today
  const appointmentsToday = appointments.filter(appointment => {
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    );
  });

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [loadAppointments]);

  return {
    appointments,
    appointmentsToday,
    loading,
    error,
    addAppointment,
    updateAppointment,
    removeAppointment,
    loadAppointments,
    checkTimeSlotAvailability,
    getAppointmentsByDate
  };
} 