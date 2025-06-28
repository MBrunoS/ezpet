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
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Query Keys
export const stockKeys = {
  all: ['stock'] as const,
  lists: () => [...stockKeys.all, 'list'] as const,
  list: (userId: string) => [...stockKeys.lists(), userId] as const,
  details: () => [...stockKeys.all, 'detail'] as const,
  detail: (id: string) => [...stockKeys.details(), id] as const,
  lowStock: (userId: string) => [...stockKeys.all, 'lowStock', userId] as const,
};

// Fetch function
const fetchProducts = async (userId: string): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

// Query hook
export function useStock() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: stockKeys.list(user?.uid || ''),
    queryFn: () => fetchProducts(user!.uid),
    enabled: !!user,
  });
}

// Query hook for low stock products
export function useLowStockProducts() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: stockKeys.lowStock(user?.uid || ''),
    queryFn: async () => {
      const products = await fetchProducts(user!.uid);
      return products.filter(product => product.quantity <= product.minStock);
    },
    enabled: !!user,
  });
}

// Mutations
export function useAddProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'userId'>) => {
      const newProduct = {
        ...product,
        userId: user!.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      return addDoc(collection(db, 'products'), newProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockKeys.lowStock(user!.uid) });
      toast.success('Produto cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar produto');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const productRef = doc(db, 'products', id);
      return updateDoc(productRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockKeys.lowStock(user!.uid) });
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar produto');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteDoc(doc(db, 'products', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockKeys.lowStock(user!.uid) });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir produto');
    },
  });
} 