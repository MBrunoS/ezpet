import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

interface StockState {
  products: Product[];
  lowStockProducts: Product[];
  loading: boolean;
  error: string | null;
}

interface StockMethods {
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (id: string, updatedData: Partial<Product>) => Promise<boolean>;
  removeProduct: (id: string) => Promise<boolean>;
  updateStock: (id: string, quantity: number) => Promise<boolean>;
  loadProducts: () => Promise<void>;
}

export function useStock(): StockState & StockMethods {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (): Promise<void> => {
    setLoading(true);
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>): Promise<boolean> => {
    try {
      const newProduct = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'products'), newProduct);
      await loadProducts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
      return false;
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>): Promise<boolean> => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      await loadProducts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
      return false;
    }
  };

  const removeProduct = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'products', id));
      await loadProducts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
      return false;
    }
  };

  const updateStock = async (id: string, quantity: number): Promise<boolean> => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        quantity,
        updatedAt: serverTimestamp()
      });
      await loadProducts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Um erro ocorreu');
      return false;
    }
  };

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock);

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    lowStockProducts,
    loading,
    error,
    addProduct,
    updateProduct,
    removeProduct,
    updateStock,
    loadProducts
  };
} 