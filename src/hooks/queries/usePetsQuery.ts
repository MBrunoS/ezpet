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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Pet } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Query Keys
export const petKeys = {
  all: ['pets'] as const,
  lists: () => [...petKeys.all, 'list'] as const,
  list: (userId: string) => [...petKeys.lists(), userId] as const,
  details: () => [...petKeys.all, 'detail'] as const,
  detail: (id: string) => [...petKeys.details(), id] as const,
  byClient: (clientId: string) => [...petKeys.all, 'client', clientId] as const,
};

// Fetch function
const fetchPets = async (userId: string): Promise<Pet[]> => {
  const petsRef = collection(db, 'pets');
  const q = query(petsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Pet[];
};

// Query hook
export function usePets() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: petKeys.list(user?.uid || ''),
    queryFn: () => fetchPets(user!.uid),
    enabled: !!user,
  });
}

// Query hook for pets by client
export function usePetsByClient(clientId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: petKeys.byClient(clientId),
    queryFn: async () => {
      const petsRef = collection(db, 'pets');
      const q = query(
        petsRef, 
        where('userId', '==', user!.uid),
        where('clientId', '==', clientId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Pet[];
    },
    enabled: !!user && !!clientId,
  });
}

// Mutations
export function useAddPet() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (pet: Omit<Pet, 'id' | 'userId'>) => {
      const newPet = {
        ...pet,
        userId: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      return addDoc(collection(db, 'pets'), newPet);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      queryClient.invalidateQueries({ queryKey: petKeys.byClient(variables.clientId) });
      toast.success('Pet criado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar pet');
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Pet> }) => {
      const petRef = doc(db, 'pets', id);
      return updateDoc(petRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      if (variables.data.clientId) {
        queryClient.invalidateQueries({ queryKey: petKeys.byClient(variables.data.clientId) });
      }
      toast.success('Pet atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar pet');
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      return deleteDoc(doc(db, 'pets', id));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      queryClient.invalidateQueries({ queryKey: petKeys.byClient(variables.clientId) });
      toast.success('Pet excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir pet');
    },
  });
} 