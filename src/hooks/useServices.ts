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
import { toast } from 'sonner';

interface ServicesState {
  services: Service[];
  loading: boolean;
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
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar serviços');
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
      toast.success('Serviço criado com sucesso!');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar serviço');
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
      toast.success('Serviço atualizado com sucesso!');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar serviço');
      return false;
    }
  }, [loadServices]);

  const removeService = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      await deleteDoc(doc(db, 'services', id));
      await loadServices();
      toast.success('Serviço excluído com sucesso!');
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir serviço');
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
    addService,
    updateService,
    removeService,
    loadServices,
    getActiveServices,
    getServiceById
  };
} 