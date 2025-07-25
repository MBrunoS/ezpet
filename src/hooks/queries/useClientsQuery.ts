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
  serverTimestamp, 
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { petKeys } from './usePetsQuery';

// Query Keys
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (userId: string) => [...clientKeys.lists(), userId] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

// Fetch function
const fetchClients = async (userId: string): Promise<Client[]> => {
  const clientsRef = collection(db, 'clients');
  const q = query(clientsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Client[];
};

// Fetch function for client by phone or email (for self-booking)
const fetchClientByPhoneOrEmail = async (userId: string, phoneOrEmail: string): Promise<Client | null> => {
  const clientsRef = collection(db, 'clients');
  
  // Buscar por telefone
  const phoneQuery = query(clientsRef, where('userId', '==', userId), where('phone', '==', phoneOrEmail));
  const phoneSnapshot = await getDocs(phoneQuery);
  
  if (!phoneSnapshot.empty) {
    const doc = phoneSnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Client;
  }
  
  // Buscar por email
  const emailQuery = query(clientsRef, where('userId', '==', userId), where('email', '==', phoneOrEmail));
  const emailSnapshot = await getDocs(emailQuery);
  
  if (!emailSnapshot.empty) {
    const doc = emailSnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Client;
  }
  
  return null;
};

// Query hook
export function useClients() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: clientKeys.list(user?.uid || ''),
    queryFn: () => fetchClients(user!.uid),
    enabled: !!user,
  });
}

// Query hook for client by phone or email
export function useClientByPhoneOrEmail(phoneOrEmail: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [...clientKeys.details(), 'search', phoneOrEmail],
    queryFn: () => fetchClientByPhoneOrEmail(user!.uid, phoneOrEmail),
    enabled: !!user && !!phoneOrEmail,
  });
}

// Query hook for client by phone or email (public booking version)
export function useClientByPhoneOrEmailPublic(userId: string, phoneOrEmail: string) {
  return useQuery({
    queryKey: [...clientKeys.details(), 'search', phoneOrEmail, userId],
    queryFn: () => fetchClientByPhoneOrEmail(userId, phoneOrEmail),
    enabled: !!userId && !!phoneOrEmail,
  });
}

// Hook for manual client search (public booking version)
export function useManualClientSearch() {
  return useMutation({
    mutationFn: async ({ userId, phoneOrEmail }: { userId: string; phoneOrEmail: string }) => {
      return fetchClientByPhoneOrEmail(userId, phoneOrEmail);
    },
  });
}

// Mutations
export function useAddClient() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (client: Omit<Client, 'id' | 'petsCount' | 'userId'>) => {
      const newClient = {
        ...client,
        userId: user!.uid,
        petsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      return addDoc(collection(db, 'clients'), newClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success('Cliente cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar cliente');
    },
  });
}

// Mutation for adding client (public booking version)
export function useAddClientPublic(userId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (client: Omit<Client, 'id' | 'petsCount' | 'userId'>) => {
      const newClient = {
        ...client,
        userId: userId,
        petsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      return addDoc(collection(db, 'clients'), newClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success('Cliente cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar cliente');
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Client> }) => {
      const clientRef = doc(db, 'clients', id);
      return updateDoc(clientRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar cliente');
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Primeiro, buscar e remover todos os pets associados ao cliente
      const petsRef = collection(db, 'pets');
      const petsQuery = query(petsRef, where('clientId', '==', id), where('userId', '==', user!.uid));
      const petsSnapshot = await getDocs(petsQuery);
      
      // Remover todos os pets em lote
      const deletePetsPromises = petsSnapshot.docs.map(petDoc => 
        deleteDoc(doc(db, 'pets', petDoc.id))
      );
      await Promise.all(deletePetsPromises);
      
      // Depois remover o cliente
      return deleteDoc(doc(db, 'clients', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      toast.success('Cliente excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir cliente');
    },
  });
}

export function useIncrementPetsCount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clientId: string) => {
      const clientRef = doc(db, 'clients', clientId);
      return updateDoc(clientRef, {
        petsCount: increment(1),
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar contador de pets');
    },
  });
}

export function useDecrementPetsCount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clientId: string) => {
      const clientRef = doc(db, 'clients', clientId);
      return updateDoc(clientRef, {
        petsCount: increment(-1),
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar contador de pets');
    },
  });
} 