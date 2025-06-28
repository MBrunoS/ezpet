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
  serverTimestamp, 
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ClientsState {
  clients: Client[];
  loading: boolean;
}

interface ClientsMethods {
  addClient: (client: Omit<Client, 'id' | 'petsCount' | 'userId'>) => Promise<string | null>;
  updateClient: (id: string, updatedData: Partial<Client>) => Promise<boolean>;
  removeClient: (id: string) => Promise<boolean>;
  loadClients: () => Promise<void>;
  incrementPetsCount: (clientId: string) => Promise<boolean>;
  decrementPetsCount: (clientId: string) => Promise<boolean>;
}

export function useClients(): ClientsState & ClientsMethods {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadClients = async (): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      setClients(clientsData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  const addClient = async (client: Omit<Client, 'id' | 'petsCount' | 'userId'>): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const newClient = {
        ...client,
        userId: user.uid,
        petsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'clients'), newClient);
      await loadClients();
      toast.success('Cliente criado com sucesso!');
      return docRef.id;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar cliente');
      return null;
    }
  };

  const updateClient = async (id: string, updatedData: Partial<Client>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const clientRef = doc(db, 'clients', id);
      await updateDoc(clientRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      await loadClients();
      toast.success('Cliente atualizado com sucesso!');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar cliente');
      return false;
    }
  };

  const removeClient = async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Primeiro, buscar e remover todos os pets associados ao cliente
      const petsRef = collection(db, 'pets');
      const petsQuery = query(petsRef, where('clientId', '==', id), where('userId', '==', user.uid));
      const petsSnapshot = await getDocs(petsQuery);
      
      // Remover todos os pets em lote
      const deletePetsPromises = petsSnapshot.docs.map(petDoc => 
        deleteDoc(doc(db, 'pets', petDoc.id))
      );
      await Promise.all(deletePetsPromises);
      
      // Depois remover o cliente
      await deleteDoc(doc(db, 'clients', id));
      await loadClients();
      toast.success('Cliente excluído com sucesso!');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir cliente');
      return false;
    }
  };

  const incrementPetsCount = async (clientId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const clientRef = doc(db, 'clients', clientId);
      await updateDoc(clientRef, {
        petsCount: increment(1),
        updatedAt: serverTimestamp()
      });
      await loadClients();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar contador de pets');
      return false;
    }
  };

  const decrementPetsCount = async (clientId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const clientRef = doc(db, 'clients', clientId);
      await updateDoc(clientRef, {
        petsCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      await loadClients();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar contador de pets');
      return false;
    }
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    removeClient,
    loadClients,
    incrementPetsCount,
    decrementPetsCount
  };
} 