import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Cliente } from '../types';

interface ClientesState {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
}

interface ClientesMethods {
  adicionarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<boolean>;
  atualizarCliente: (id: string, dadosAtualizados: Partial<Cliente>) => Promise<boolean>;
  removerCliente: (id: string) => Promise<boolean>;
  carregarClientes: () => Promise<void>;
}

export function useClientes(): ClientesState & ClientesMethods {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarClientes = async (): Promise<void> => {
    setLoading(true);
    try {
      const clientesRef = collection(db, 'clientes');
      const snapshot = await getDocs(clientesRef);
      const clientesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Cliente[];
      setClientes(clientesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const adicionarCliente = async (cliente: Omit<Cliente, 'id'>): Promise<boolean> => {
    try {
      const novoCliente = {
        ...cliente,
        dataCadastro: serverTimestamp(),
        dataAtualizacao: serverTimestamp()
      };
      await addDoc(collection(db, 'clientes'), novoCliente);
      await carregarClientes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const atualizarCliente = async (id: string, dadosAtualizados: Partial<Cliente>): Promise<boolean> => {
    try {
      const clienteRef = doc(db, 'clientes', id);
      await updateDoc(clienteRef, {
        ...dadosAtualizados,
        dataAtualizacao: serverTimestamp()
      });
      await carregarClientes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const removerCliente = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'clientes', id));
      await carregarClientes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  return {
    clientes,
    loading,
    error,
    adicionarCliente,
    atualizarCliente,
    removerCliente,
    carregarClientes
  };
} 