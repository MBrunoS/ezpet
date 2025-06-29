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
  serverTimestamp,
  increment,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, StockMovement } from '@/types';
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
  movements: () => [...stockKeys.all, 'movements'] as const,
  movementsList: (userId: string) => [...stockKeys.movements(), userId] as const,
  productMovements: (productId: string) => [...stockKeys.movements(), 'product', productId] as const,
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

// Fetch function for stock movements
const fetchStockMovements = async (userId: string): Promise<StockMovement[]> => {
  const movementsRef = collection(db, 'stockMovements');
  const q = query(
    movementsRef, 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date()
  })) as StockMovement[];
};

// Fetch function for product movements
const fetchProductMovements = async (productId: string): Promise<StockMovement[]> => {
  const movementsRef = collection(db, 'stockMovements');
  const q = query(
    movementsRef, 
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date()
  })) as StockMovement[];
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

// Query hook for stock movements
export function useStockMovements() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: stockKeys.movementsList(user?.uid || ''),
    queryFn: () => fetchStockMovements(user!.uid),
    enabled: !!user,
  });
}

// Query hook for product movements
export function useProductMovements(productId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: stockKeys.productMovements(productId),
    queryFn: () => fetchProductMovements(productId),
    enabled: !!user && !!productId,
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

// Mutation for stock movement
export function useStockMovement() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      productId, 
      productName, 
      type, 
      quantity, 
      reason, 
      observation 
    }: {
      productId: string;
      productName: string;
      type: 'entrada' | 'saida';
      quantity: number;
      reason: string;
      observation?: string;
    }) => {
      // Get current product to check quantity
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDocs(query(collection(db, 'products'), where('__name__', '==', productId)));
      
      if (productDoc.empty) {
        throw new Error('Produto não encontrado');
      }
      
      const currentProduct = productDoc.docs[0].data() as Product;
      const previousQuantity = currentProduct.quantity;
      
      // Calculate new quantity
      let newQuantity: number;
      if (type === 'entrada') {
        newQuantity = previousQuantity + quantity;
      } else {
        if (previousQuantity < quantity) {
          throw new Error('Quantidade insuficiente em estoque');
        }
        newQuantity = previousQuantity - quantity;
      }
      
      // Update product quantity
      await updateDoc(productRef, {
        quantity: newQuantity,
        updatedAt: serverTimestamp()
      });
      
      // Create movement record
      const movement = {
        userId: user!.uid,
        productId,
        productName,
        type,
        quantity,
        previousQuantity,
        newQuantity,
        reason,
        observation,
        createdAt: serverTimestamp()
      };
      
      return addDoc(collection(db, 'stockMovements'), movement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockKeys.lowStock(user!.uid) });
      queryClient.invalidateQueries({ queryKey: stockKeys.movements() });
      toast.success('Movimentação registrada com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Erro ao registrar movimentação');
    },
  });
} 