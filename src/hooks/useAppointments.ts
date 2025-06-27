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
import { Appointment } from '../types';

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
  checkTimeSlotAvailability: (date: Date, excludeId?: string) => Promise<boolean>;
  getAppointmentsByDate: (date: Date) => Promise<Appointment[]>;
}

export function useAppointments(): AppointmentsState & AppointmentsMethods {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];
      setAppointments(appointmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkTimeSlotAvailability = useCallback(async (
    date: Date, 
    excludeId?: string
  ): Promise<boolean> => {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        where('status', '!=', 'canceled')
      );

      const snapshot = await getDocs(q);
      const appointmentsWithConflict = snapshot.docs.filter(doc => {
        const appointment = doc.data();
        const appointmentDate = appointment.date.toDate();
        
        // Verificar se é o mesmo horário (com tolerância de 30 minutos)
        const timeDiff = Math.abs(appointmentDate.getTime() - date.getTime());
        const isSameTime = timeDiff < 30 * 60 * 1000; // 30 minutos em millisegundos
        
        return isSameTime && doc.id !== excludeId;
      });

      return appointmentsWithConflict.length === 0;
    } catch (err) {
      console.error('Erro ao verificar disponibilidade:', err);
      return false;
    }
  }, []);

  const getAppointmentsByDate = useCallback(async (date: Date): Promise<Appointment[]> => {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        orderBy('date', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];
    } catch (err) {
      console.error('Erro ao buscar agendamentos por data:', err);
      return [];
    }
  }, []);

  const addAppointment = useCallback(async (appointment: Omit<Appointment, 'id'>): Promise<boolean> => {
    try {
      // Verificar se o horário está disponível
      const isAvailable = await checkTimeSlotAvailability(appointment.date);
      if (!isAvailable) {
        setError('Este horário já está ocupado');
        return false;
      }

      const newAppointment = {
        ...appointment,
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
  }, [loadAppointments, checkTimeSlotAvailability]);

  const updateAppointment = useCallback(async (id: string, updatedData: Partial<Appointment>): Promise<boolean> => {
    try {
      // Se estiver atualizando a data/hora, verificar disponibilidade
      if (updatedData.date) {
        const isAvailable = await checkTimeSlotAvailability(updatedData.date, id);
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
    try {
      await deleteDoc(doc(db, 'appointments', id));
      await loadAppointments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [loadAppointments]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const appointmentsToday = appointments.filter(appointment => {
    const today = new Date();
    const appointmentDate = appointment.date;
    
    return appointmentDate && 
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear();
  });

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