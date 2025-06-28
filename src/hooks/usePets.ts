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

interface PetsState {
  pets: Pet[];
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
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
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
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
      if (onPetAdded) {
        onPetAdded();
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
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
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
      return false;
    }
  }, [loadAllPets]);

  const removePet = useCallback(async (id: string, clientId: string, onPetRemoved?: () => void): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await deleteDoc(doc(db, 'pets', id));
      await loadAllPets();
      if (onPetRemoved) {
        onPetRemoved();
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
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
    error,
    addPet,
    updatePet,
    removePet,
    loadPetsByClient,
    loadAllPets
  };
} 