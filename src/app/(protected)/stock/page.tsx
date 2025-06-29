"use client";

import React, { useState, useMemo } from "react";
import { useStock, useStockMovements } from "@/hooks/queries/useStockQuery";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Package, ArrowUpDown } from "lucide-react";
import {
  ProductTable,
  ProductFilters,
  StockMovementsTable,
} from "./components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { filterProducts } from "./utils/filterProducts";
import { useDialogActions } from "@/contexts/DialogContext";

export default function StockPage() {
  const { data: products, isLoading } = useStock();
  const { data: movements, isLoading: movementsLoading } = useStockMovements();
  const { openProductForm, openDeleteConfirmation, openStockMovementForm } =
    useDialogActions();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return filterProducts(products, searchTerm, statusFilter);
  }, [products, searchTerm, statusFilter]);

  const handleEdit = (product: Product) => {
    openProductForm(product);
  };

  const handleDelete = (product: Product) => {
    openDeleteConfirmation({
      id: product.id,
      name: product.name,
      type: "produto",
    });
  };

  const openNewForm = () => {
    openProductForm();
  };

  const openMovementForm = () => {
    openStockMovementForm();
  };

  const openMovementFormForProduct = (product: Product) => {
    openStockMovementForm(product);
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
                Produtos ({filteredProducts.length} de {products?.length || 0})
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
            <div className="p-6 space-y-4">
              <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />

              <ProductTable
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMovement={openMovementFormForProduct}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
