import { useState, useEffect, useMemo } from 'react';
import { usePetShopProfile } from '@/hooks/queries/usePetShopProfileQuery';
import { useAppointments } from '@/hooks/queries/useAppointmentsQuery';
import { useServices } from '@/hooks/queries/useServicesQuery';
import { Service } from '@/types';

interface UseAvailableTimeSlotsProps {
  selectedDate: Date;
  selectedService: Service | null;
}

interface TimeSlot {
  time: Date;
  available: boolean;
  reason?: string;
}

export function useAvailableTimeSlots({ selectedDate, selectedService }: UseAvailableTimeSlotsProps) {
  const { data: profile } = usePetShopProfile();
  const { data: appointments } = useAppointments();
  const { data: services } = useServices();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Obter o dia da semana da data selecionada
  const getDayOfWeek = (date: Date): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  // Converter string de hora para Date
  const timeStringToDate = (timeString: string, date: Date): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  // Verificar se um horário está dentro do período de almoço
  const isWithinLunchTime = (time: Date): boolean => {
    if (!profile?.lunchStart || !profile?.lunchEnd) return false;
    
    const lunchStart = timeStringToDate(profile.lunchStart, selectedDate);
    const lunchEnd = timeStringToDate(profile.lunchEnd, selectedDate);
    
    return time >= lunchStart && time < lunchEnd;
  };

  // Verificar se há conflito de horário com agendamentos existentes
  const hasTimeConflict = (startTime: Date, endTime: Date): boolean => {
    const dayAppointments = appointments?.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === selectedDate.toDateString();
    }) || [];

    return dayAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.date);
      // Buscar o serviço pelo serviceId para obter a duração
      const service = services?.find(s => s.id === appointment.serviceId);
      const appointmentDuration = service?.duration || 60;
      const appointmentEnd = new Date(appointmentStart.getTime() + appointmentDuration * 60000);
      
      // Verificar se há sobreposição
      return (startTime < appointmentEnd && endTime > appointmentStart);
    });
  };

  // Verificar se o limite de agendamentos foi atingido
  const isCapacityReached = (time: Date): boolean => {
    if (!profile?.appointmentCapacity) return false;
    
    const dayAppointments = appointments?.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === selectedDate.toDateString();
    }) || [];

    // Contar agendamentos que realmente se sobrepõem com o horário proposto
    const overlappingAppointments = dayAppointments.filter(appointment => {
      const appointmentStart = new Date(appointment.date);
      const service = services?.find(s => s.id === appointment.serviceId);
      const appointmentDuration = service?.duration || 60;
      const appointmentEnd = new Date(appointmentStart.getTime() + appointmentDuration * 60000);
      
      // Verificar se há sobreposição real
      const proposedEnd = new Date(time.getTime() + (selectedService?.duration || 60) * 60000);
      return (time < appointmentEnd && proposedEnd > appointmentStart);
    });

    return overlappingAppointments.length >= profile.appointmentCapacity;
  };

  // Gerar todos os horários possíveis
  const generateAllTimeSlots = (): TimeSlot[] => {
    if (!profile || !selectedService) return [];

    const dayOfWeek = getDayOfWeek(selectedDate);
    const workingDay = profile.workingHours.find(day => day.day === dayOfWeek);
    
    if (!workingDay || !workingDay.isOpen) {
      return [];
    }

    const slots: TimeSlot[] = [];
    const startTime = timeStringToDate(workingDay.openTime, selectedDate);
    const endTime = timeStringToDate(workingDay.closeTime, selectedDate);
    const serviceDuration = selectedService.duration || 60;
    
    // Gerar slots a cada 30 minutos
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + serviceDuration * 60000);
      
      // Verificar se o slot termina antes do fechamento
      if (slotEndTime <= endTime) {
        const isLunchTime = isWithinLunchTime(currentTime);
        const hasConflict = hasTimeConflict(currentTime, slotEndTime);
        const capacityReached = isCapacityReached(currentTime);
        
        let available = true;
        let reason = '';
        
        if (isLunchTime) {
          available = false;
          reason = 'Horário de almoço';
        } else if (hasConflict) {
          available = false;
          reason = 'Horário ocupado';
        } else if (capacityReached) {
          available = false;
          reason = 'Limite de agendamentos atingido';
        }
        
        slots.push({
          time: new Date(currentTime),
          available,
          reason
        });
      }
      
      // Avançar 30 minutos
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    return slots;
  };

  // Calcular horários disponíveis quando as dependências mudarem
  useEffect(() => {
    setLoading(true);
    
    const slots = generateAllTimeSlots();
    setAvailableSlots(slots);
    
    setLoading(false);
  }, [selectedDate, selectedService, profile, appointments, services]);

  // Filtrar apenas horários disponíveis
  const availableTimeSlots = useMemo(() => {
    return availableSlots.filter(slot => slot.available);
  }, [availableSlots]);

  // Formatar horário para exibição
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    availableTimeSlots,
    allTimeSlots: availableSlots,
    loading,
    formatTime,
    isWorkingDay: profile?.workingHours.find(day => day.day === getDayOfWeek(selectedDate))?.isOpen || false
  };
} 