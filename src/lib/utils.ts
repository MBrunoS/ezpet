import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { Agendamento, Produto } from '../types';

export const formatDate = (date: Date | Timestamp | null): string => {
  if (!date) return '';
  return format(date instanceof Date ? date : date.toDate(), 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (date: Date | Timestamp | null): string => {
  if (!date) return '';
  return format(date instanceof Date ? date : date.toDate(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const generateNotificationMessage = (type: 'lowStock' | 'appointment', item: Produto | Agendamento): string => {
  const messages = {
    lowStock: `Estoque baixo: ${(item as Produto).nome} (${(item as Produto).quantidade} restantes)`,
    appointment: `Agendamento: ${(item as Agendamento).servicoNome} para ${(item as Agendamento).petNome} às ${format((item as Agendamento).data, 'HH:mm')}`,
  };
  
  return messages[type] || '';
}; 