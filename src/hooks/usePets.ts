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

interface PetsState {
  pets: Pet[];
  loading: boolean;
  error: string | null;
}

interface PetsMethods {
  addPet: (pet: Omit<Pet, 'id'>, clientId: string) => Promise<boolean>;
  updatePet: (id: string, updatedData: Partial<Pet>) => Promise<boolean>;
  removePet: (id: string) => Promise<boolean>;
  loadPetsByClient: (clientId: string) => Promise<Pet[]>;
  loadAllPets: () => Promise<void>;
}

export function usePets(): PetsState & PetsMethods {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllPets = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const petsRef = collection(db, 'pets');
      const snapshot = await getDocs(petsRef);
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
  }, []);

  const loadPetsByClient = useCallback(async (clientId: string): Promise<Pet[]> => {
    try {
      const petsRef = collection(db, 'pets');
      const q = query(petsRef, where('clientId', '==', clientId));
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
  }, []);

  const addPet = useCallback(async (pet: Omit<Pet, 'id'>, clientId: string): Promise<boolean> => {
    try {
      const newPet = {
        ...pet,
        clientId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'pets'), newPet);
      await loadAllPets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
      return false;
    }
  }, [loadAllPets]);

  const updatePet = useCallback(async (id: string, updatedData: Partial<Pet>): Promise<boolean> => {
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

  const removePet = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'pets', id));
      await loadAllPets();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
      return false;
    }
  }, [loadAllPets]);

  useEffect(() => {
    loadAllPets();
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