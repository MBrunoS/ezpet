"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types";
import { stockMovementSchema, StockMovementFormData } from "../schema";

interface StockMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockMovementFormData) => Promise<void>;
  products: Product[];
  preselectedProduct?: Product | null;
}

export function StockMovementForm({
  isOpen,
  onClose,
  onSubmit,
  products,
  preselectedProduct,
}: StockMovementFormProps) {
  const form = useForm<StockMovementFormData>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues: {
      productId: "",
      type: "entrada",
      quantity: 1,
      reason: "",
      observation: "",
    },
  });

  React.useEffect(() => {
    if (preselectedProduct) {
      form.setValue("productId", preselectedProduct.id);
    }
  }, [preselectedProduct, form]);

  const handleSubmit = async (data: StockMovementFormData) => {
    await onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const selectedProduct = products.find(
    (p) => p.id === form.watch("productId")
  );
  const movementType = form.watch("type");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Movimentação</DialogTitle>
          <DialogDescription>
            Registre uma entrada ou saída de produto no estoque
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - Estoque: {product.quantity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Movimentação</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProduct && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <div>
                    Produto:{" "}
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div>
                    Estoque atual:{" "}
                    <span className="font-medium">
                      {selectedProduct.quantity}
                    </span>
                  </div>
                  {movementType === "saida" && (
                    <div className="text-red-600">
                      Estoque após saída:{" "}
                      <span className="font-medium">
                        {Math.max(
                          0,
                          selectedProduct.quantity -
                            (form.watch("quantity") || 0)
                        )}
                      </span>
                    </div>
                  )}
                  {movementType === "entrada" && (
                    <div className="text-green-600">
                      Estoque após entrada:{" "}
                      <span className="font-medium">
                        {selectedProduct.quantity +
                          (form.watch("quantity") || 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Compra de fornecedor, Venda, Ajuste de estoque"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais sobre a movimentação..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">Registrar Movimentação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
