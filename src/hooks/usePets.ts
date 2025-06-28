import { useState, useEffect, useCallback } from 'react';
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
import { Pet } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PetsState {
  pets: Pet[];
  loading: boolean;
}

interface PetsMethods {
  addPet: (pet: Omit<Pet, 'id'>, clientId: string, onPetAdded?: () => void) => Promise<boolean>;
  updatePet: (id: string, updatedData: Partial<Pet>) => Promise<boolean>;
  removePet: (id: string, clientId: string, onPetRemoved?: () => void) => Promise<boolean>;
  loadPetsByClient: (clientId: string) => Promise<Pet[]>;
  loadAllPets: () => Promise<void>;
}

export function usePets(): PetsState & PetsMethods {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAllPets = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const petsRef = collection(db, 'pets');
      const q = query(petsRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const petsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Pet[];
      setPets(petsData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar pets');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadPetsByClient = useCallback(async (clientId: string): Promise<Pet[]> => {
    if (!user) return [];
    
    try {
      const petsRef = collection(db, 'pets');
      const q = query(petsRef, where('clientId', '==', clientId), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const petsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Pet[];
      return petsData;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar pets');
      return [];
    }
  }, [user]);

  const addPet = useCallback(async (pet: Omit<Pet, 'id'>, clientId: string, onPetAdded?: () => void): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newPet = {
        ...pet,
        clientId,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'pets'), newPet);
      await loadAllPets();
      toast.success('Pet criado com sucesso!');
      if (onPetAdded) {
        onPetAdded();
      }
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar pet');
      return false;
    }
  }, [loadAllPets, user]);

  const updatePet = useCallback(async (id: string, updatedData: Partial<Pet>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const petRef = doc(db, 'pets', id);
      await updateDoc(petRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      await loadAllPets();
      toast.success('Pet atualizado com sucesso!');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar pet');
      return false;
    }
  }, [loadAllPets]);

  const removePet = useCallback(async (id: string, clientId: string, onPetRemoved?: () => void): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await deleteDoc(doc(db, 'pets', id));
      await loadAllPets();
      toast.success('Pet excluído com sucesso!');
      if (onPetRemoved) {
        onPetRemoved();
      }
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir pet');
      return false;
    }
  }, [loadAllPets]);

  useEffect(() => {
    if (user) {
      loadAllPets();
    }
  }, [loadAllPets]);

  return {
    pets,
    loading,
    addPet,
    updatePet,
    removePet,
    loadPetsByClient,
    loadAllPets
  };
} 