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
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceFormData } from '@/app/dashboard/services/schema';
import { toast } from 'sonner';

// Query Keys
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (userId: string) => [...serviceKeys.lists(), userId] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

// Fetch function
const fetchServices = async (userId: string): Promise<Service[]> => {
  const servicesRef = collection(db, 'services');
  const q = query(
    servicesRef, 
    where('userId', '==', userId),
    orderBy('name', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Service[];
};

// Query hook
export function useServices() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: serviceKeys.list(user?.uid || ''),
    queryFn: () => fetchServices(user!.uid),
    enabled: !!user,
  });
}

// Query hook for services (public booking version)
export function useServicesPublic(userId: string) {
  return useQuery({
    queryKey: [...serviceKeys.list(userId), 'public'],
    queryFn: () => fetchServices(userId),
    enabled: !!userId,
  });
}

// Mutations
export function useAddService() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (service: ServiceFormData) => {
      const newService = {
        ...service,
        userId: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };
      return addDoc(collection(db, 'services'), newService);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      toast.success('Serviço cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar serviço');
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ServiceFormData | Partial<Service> }) => {
      const serviceRef = doc(db, 'services', id);
      return updateDoc(serviceRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      toast.success('Serviço atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar serviço');
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteDoc(doc(db, 'services', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      toast.success('Serviço excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir serviço');
    },
  });
} 