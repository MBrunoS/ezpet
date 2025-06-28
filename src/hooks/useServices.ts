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
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Service } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceFormData } from '@/app/(protected)/services/schema';

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface ServicesMethods {
  addService: (service: ServiceFormData) => Promise<boolean>;
  updateService: (id: string, updatedData: DeepPartial<Service>) => Promise<boolean>;
  removeService: (id: string) => Promise<boolean>;
  loadServices: () => Promise<void>;
  getActiveServices: () => Service[];
  getServiceById: (id: string) => Service | undefined;
}

export function useServices(): ServicesState & ServicesMethods {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      const servicesRef = collection(db, 'services');
      const q = query(
        servicesRef, 
        where('userId', '==', user.uid),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Service[];
      setServices(servicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addService = useCallback(async (service: ServiceFormData): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const newService = {
        ...service,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };
      await addDoc(collection(db, 'services'), newService);
      await loadServices();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [loadServices, user]);

  const updateService = useCallback(async (id: string, updatedData: DeepPartial<Service>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      await loadServices();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [loadServices]);

  const removeService = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await deleteDoc(doc(db, 'services', id));
      await loadServices();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  }, [loadServices]);

  const getActiveServices = useCallback((): Service[] => {
    return services.filter(service => service.isActive);
  }, [services]);

  const getServiceById = useCallback((id: string): Service | undefined => {
    return services.find(service => service.id === id);
  }, [services]);

  useEffect(() => {
    if (user) {
      loadServices();
    }
  }, [loadServices]);

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    removeService,
    loadServices,
    getActiveServices,
    getServiceById
  };
} 