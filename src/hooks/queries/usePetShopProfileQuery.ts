import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PetShopProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Query Keys
export const profileKeys = {
  all: ['profile'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (userId: string) => [...profileKeys.details(), userId] as const,
};

// Fetch function
const fetchProfile = async (userId: string): Promise<PetShopProfile | null> => {
  const profileRef = collection(db, 'petShopProfiles');
  const q = query(profileRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as PetShopProfile;
};

// Query hook
export function usePetShopProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: profileKeys.detail(user?.uid || ''),
    queryFn: () => fetchProfile(user!.uid),
    enabled: !!user,
  });
}

// Mutations
export function useCreateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (profile: Omit<PetShopProfile, 'id' | 'userId'>) => {
      const newProfile = {
        ...profile,
        userId: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      return addDoc(collection(db, 'petShopProfiles'), newProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.details() });
      toast.success('Perfil criado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar perfil');
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PetShopProfile> }) => {
      const profileRef = doc(db, 'petShopProfiles', id);
      return updateDoc(profileRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.details() });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar perfil');
    },
  });
} 