import { useState, useEffect } from 'react';
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
import { Produto } from '../types';

interface EstoqueState {
  produtos: Produto[];
  produtosBaixoEstoque: Produto[];
  loading: boolean;
  error: string | null;
}

interface EstoqueMethods {
  adicionarProduto: (produto: Omit<Produto, 'id'>) => Promise<boolean>;
  atualizarProduto: (id: string, dadosAtualizados: Partial<Produto>) => Promise<boolean>;
  removerProduto: (id: string) => Promise<boolean>;
  atualizarEstoque: (id: string, quantidade: number) => Promise<boolean>;
  carregarProdutos: () => Promise<void>;
}

export function useEstoque(): EstoqueState & EstoqueMethods {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const carregarProdutos = async (): Promise<void> => {
    setLoading(true);
    try {
      const produtosRef = collection(db, 'produtos');
      const snapshot = await getDocs(produtosRef);
      const produtosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Produto[];
      setProdutos(produtosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const adicionarProduto = async (produto: Omit<Produto, 'id'>): Promise<boolean> => {
    try {
      const novoProduto = {
        ...produto,
        dataCadastro: serverTimestamp(),
        dataAtualizacao: serverTimestamp()
      };
      await addDoc(collection(db, 'produtos'), novoProduto);
      await carregarProdutos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const atualizarProduto = async (id: string, dadosAtualizados: Partial<Produto>): Promise<boolean> => {
    try {
      const produtoRef = doc(db, 'produtos', id);
      await updateDoc(produtoRef, {
        ...dadosAtualizados,
        dataAtualizacao: serverTimestamp()
      });
      await carregarProdutos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const removerProduto = async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'produtos', id));
      await carregarProdutos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const atualizarEstoque = async (id: string, quantidade: number): Promise<boolean> => {
    try {
      const produtoRef = doc(db, 'produtos', id);
      await updateDoc(produtoRef, {
        quantidade,
        dataAtualizacao: serverTimestamp()
      });
      await carregarProdutos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const produtosBaixoEstoque = produtos.filter(p => p.quantidade <= p.estoqueMinimo);

  return {
    produtos,
    produtosBaixoEstoque,
    loading,
    error,
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    atualizarEstoque,
    carregarProdutos
  };
} 