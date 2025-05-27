import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Agendamento } from '../types';

interface AgendamentosState {
  agendamentos: Agendamento[];
  agendamentosHoje: Agendamento[];
  loading: boolean;
  error: string | null;
}

interface AgendamentosMethods {
  adicionarAgendamento: (agendamento: Omit<Agendamento, 'id'>) => Promise<boolean>;
  atualizarAgendamento: (id: string, dadosAtualizados: Partial<Agendamento>) => Promise<boolean>;
  removerAgendamento: (id: string) => Promise<boolean>;
  carregarAgendamentos: () => Promise<void>;
}

export function useAgendamentos(): AgendamentosState & AgendamentosMethods {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarAgendamentos = async (): Promise<void> => {
    setLoading(true);
    try {
      const agendamentosRef = collection(db, 'agendamentos');
      const snapshot = await getDocs(agendamentosRef);
      const agendamentosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Agendamento[];
      setAgendamentos(agendamentosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const adicionarAgendamento = async (agendamento: Omit<Agendamento, 'id'>): Promise<boolean> => {
    try {
      const novoAgendamento = {
        ...agendamento,
        dataCadastro: serverTimestamp(),
        status: 'agendado'
      };
      await addDoc(collection(db, 'agendamentos'), novoAgendamento);
      await carregarAgendamentos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const atualizarAgendamento = async (id: string, dadosAtualizados: Partial<Agendamento>): Promise<boolean> => {
    try {
      const agendamentoRef = doc(db, 'agendamentos', id);
      await updateDoc(agendamentoRef, dadosAtualizados);
      await carregarAgendamentos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const removerAgendamento = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'agendamentos', id));
      await carregarAgendamentos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const agendamentosHoje = agendamentos.filter(agendamento => {
    const hoje = new Date();
    const dataAgendamento = agendamento.data;
    
    return dataAgendamento && 
      dataAgendamento.getDate() === hoje.getDate() &&
      dataAgendamento.getMonth() === hoje.getMonth() &&
      dataAgendamento.getFullYear() === hoje.getFullYear();
  });

  return {
    agendamentos,
    agendamentosHoje,
    loading,
    error,
    adicionarAgendamento,
    atualizarAgendamento,
    removerAgendamento,
    carregarAgendamentos
  };
} 