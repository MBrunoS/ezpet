"use client";

import React, { useState } from "react";
import { useStock } from "@/hooks/useStock";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { ProductFormData } from "./schema";
import {
  ProductForm,
  ProductTable,
  DeleteConfirmationDialog,
} from "./components";

export default function StockPage() {
  const { products, loading, error, addProduct, updateProduct, removeProduct } =
    useStock();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productInEdit, setProductInEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleSubmit = async (data: ProductFormData) => {
    if (productInEdit) {
      await updateProduct(productInEdit.id, data);
    } else {
      await addProduct(data);
    }
  };

  const handleEdit = (product: Product) => {
    setProductInEdit(product);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await removeProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const openNewForm = () => {
    setProductInEdit(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setProductInEdit(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600">Gerencie os produtos do seu pet shop</p>
        </div>
        <Button onClick={openNewForm} className="flex gap-2 items-center">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex gap-2 items-center mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              Produtos ({products.length})
            </h2>
          </div>

          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={setProductToDelete}
          />
        </div>
      </div>

      {/* Formulário de produto */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        product={productInEdit}
      />

      {/* Dialog de confirmação para exclusão */}
      <DeleteConfirmationDialog
        product={productToDelete}
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
