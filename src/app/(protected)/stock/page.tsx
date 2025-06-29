"use client";

import React, { useState } from "react";
import {
  useStock,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  useStockMovements,
  useStockMovement,
} from "@/hooks/queries/useStockQuery";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Package, ArrowUpDown } from "lucide-react";
import { ProductFormData, StockMovementFormData } from "./schema";
import {
  ProductForm,
  ProductTable,
  DeleteConfirmationDialog,
  StockMovementForm,
  StockMovementsTable,
} from "./components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StockPage() {
  const { data: products, isLoading } = useStock();
  const { data: movements, isLoading: movementsLoading } = useStockMovements();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const stockMovementMutation = useStockMovement();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [productInEdit, setProductInEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [preselectedProduct, setPreselectedProduct] = useState<Product | null>(
    null
  );

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

  const handleMovementSubmit = async (data: StockMovementFormData) => {
    const selectedProduct = products?.find((p) => p.id === data.productId);
    if (!selectedProduct) return;

    stockMovementMutation.mutate(
      {
        productId: data.productId,
        productName: selectedProduct.name,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason,
        observation: data.observation,
      },
      {
        onSuccess: () => {
          setIsMovementFormOpen(false);
          setPreselectedProduct(null);
        },
      }
    );
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

  const openMovementForm = () => {
    setPreselectedProduct(null);
    setIsMovementFormOpen(true);
  };

  const openMovementFormForProduct = (product: Product) => {
    setPreselectedProduct(product);
    setIsMovementFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setProductInEdit(null);
  };

  const closeMovementForm = () => {
    setIsMovementFormOpen(false);
    setPreselectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando estoque...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Controle de Estoque
          </h1>
          <p className="text-gray-600">
            Gerencie produtos e movimentações do seu pet shop
          </p>
        </div>
      </div>

      <Tabs defaultValue="movements" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full h-14">
          <TabsTrigger
            value="movements"
            className="flex gap-3 items-center h-full text-lg font-semibold"
          >
            <ArrowUpDown className="w-5 h-5" />
            Movimentações
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="flex gap-3 items-center h-full text-lg font-semibold"
          >
            <Package className="w-5 h-5" />
            Produtos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="flex gap-2 items-center text-xl font-semibold">
                <ArrowUpDown className="w-5 h-5 text-green-600" />
                Movimentações ({movements?.length || 0})
              </h2>
              <p className="text-gray-600">
                Histórico de entradas e saídas de produtos
              </p>
            </div>
            <Button
              onClick={openMovementForm}
              className="flex gap-2 items-center"
            >
              <ArrowUpDown className="w-4 h-4" />
              Nova Movimentação
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              {movementsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="text-lg">Carregando movimentações...</div>
                </div>
              ) : (
                <StockMovementsTable movements={movements || []} />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="flex gap-2 items-center text-xl font-semibold">
                <Package className="w-5 h-5 text-blue-600" />
                Produtos ({products?.length || 0})
              </h2>
              <p className="text-gray-600">
                Gerencie os produtos do seu estoque
              </p>
            </div>
            <Button onClick={openNewForm} className="flex gap-2 items-center">
              <Plus className="w-4 h-4" />
              Novo Produto
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <ProductTable
                products={products || []}
                onEdit={handleEdit}
                onDelete={setProductToDelete}
                onMovement={openMovementFormForProduct}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ProductForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSubmit}
        product={productInEdit}
      />

      <StockMovementForm
        isOpen={isMovementFormOpen}
        onClose={closeMovementForm}
        onSubmit={handleMovementSubmit}
        products={products || []}
        preselectedProduct={preselectedProduct}
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
