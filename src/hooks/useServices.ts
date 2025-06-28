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

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface ServicesMethods {
  addService: (service: Omit<Service, 'id'>) => Promise<boolean>;
  updateService: (id: string, updatedData: DeepPartial<Service>) => Promise<boolean>;
  removeService: (id: string) => Promise<boolean>;
  loadServices: () => Promise<void>;
  getActiveServices: () => Service[];
  getServiceById: (id: string) => Service | undefined;
}

export function useServices(): ServicesState & ServicesMethods {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, orderBy('name', 'asc'));
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
  }, []);

  const addService = useCallback(async (service: Omit<Service, 'id'>): Promise<boolean> => {
    try {
      const newService = {
        ...service,
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
  }, [loadServices]);

  const updateService = useCallback(async (id: string, updatedData: DeepPartial<Service>): Promise<boolean> => {
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
    loadServices();
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