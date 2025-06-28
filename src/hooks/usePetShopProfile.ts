import { useState, useEffect, useCallback } from 'react';
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
import { db } from '../lib/firebase';
import { PetShopProfile, WorkingHours } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PetShopProfileState {
  profile: PetShopProfile | null;
  loading: boolean;
}

interface PetShopProfileMethods {
  loadProfile: () => Promise<void>;
  saveProfile: (profileData: Omit<PetShopProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProfile: (updatedData: Partial<PetShopProfile>) => Promise<boolean>;
}

export function usePetShopProfile(): PetShopProfileState & PetShopProfileMethods {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PetShopProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProfile = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const profileRef = collection(db, 'petShopProfiles');
      const q = query(profileRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const profileData = snapshot.docs[0];
        setProfile({
          id: profileData.id,
          ...profileData.data(),
          createdAt: profileData.data().createdAt?.toDate() || new Date(),
          updatedAt: profileData.data().updatedAt?.toDate() || new Date(),
        } as PetShopProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveProfile = useCallback(async (profileData: Omit<PetShopProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newProfile = {
        ...profileData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'petShopProfiles'), newProfile);
      await loadProfile();
      toast.success('Perfil salvo com sucesso!');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar perfil');
      return false;
    }
  }, [loadProfile, user]);

  const updateProfile = useCallback(async (updatedData: Partial<PetShopProfile>): Promise<boolean> => {
    if (!user || !profile) return false;
    
    try {
      const profileRef = doc(db, 'petShopProfiles', profile.id);
      await updateDoc(profileRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      await loadProfile();
      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
      return false;
    }
  }, [loadProfile, profile, user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [loadProfile]);

  return {
    profile,
    loading,
    loadProfile,
    saveProfile,
    updateProfile
  };
} 