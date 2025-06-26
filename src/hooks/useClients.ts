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
import { Client } from '../types';

interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

interface ClientsMethods {
  addClient: (client: Omit<Client, 'id'>) => Promise<boolean>;
  updateClient: (id: string, updatedData: Partial<Client>) => Promise<boolean>;
  removeClient: (id: string) => Promise<boolean>;
  loadClients: () => Promise<void>;
}

export function useClients(): ClientsState & ClientsMethods {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async (): Promise<void> => {
    setLoading(true);
    try {
      const clientsRef = collection(db, 'clients');
      const snapshot = await getDocs(clientsRef);
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      setClients(clientsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const addClient = async (client: Omit<Client, 'id'>): Promise<boolean> => {
    try {
      const newClient = {
        ...client,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'clients'), newClient);
      await loadClients();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const updateClient = async (id: string, updatedData: Partial<Client>): Promise<boolean> => {
    try {
      const clientRef = doc(db, 'clients', id);
      await updateDoc(clientRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      await loadClients();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const removeClient = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'clients', id));
      await loadClients();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    removeClient,
    loadClients
  };
} 