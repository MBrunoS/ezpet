"use client";

import React, { useState } from "react";
import {
  useStock,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/queries/useStockQuery";
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
  const { data: products, isLoading } = useStock();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productInEdit, setProductInEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleSubmit = async (data: ProductFormData) => {
    if (productInEdit) {
      updateProductMutation.mutate(
        { id: productInEdit.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setProductInEdit(null);
          },
        }
      );
    } else {
      addProductMutation.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleEdit = (product: Product) => {
    setProductInEdit(product);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id, {
        onSuccess: () => {
          setProductToDelete(null);
        },
      });
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando produtos...</div>
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
              Produtos ({products?.length || 0})
            </h2>
          </div>

          <ProductTable
            products={products || []}
            onEdit={handleEdit}
            onDelete={setProductToDelete}
          />
        </div>
      </div>

      <ProductForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        product={productInEdit}
      />

      <DeleteConfirmationDialog
        product={productToDelete}
        isOpen={!!productToDelete}
        onConfirm={handleDelete}
        onClose={() => setProductToDelete(null)}
      />
    </div>
  );
}
