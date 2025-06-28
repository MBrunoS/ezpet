"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { ServiceExtra } from "@/types";
import { ServiceExtraFormData } from "../schema";

interface ServiceExtrasProps {
  extras: ServiceExtra[];
  onExtrasChange: (extras: ServiceExtra[]) => void;
}

export function ServiceExtras({ extras, onExtrasChange }: ServiceExtrasProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExtra, setEditingExtra] = useState<ServiceExtra | null>(null);

  const form = useForm<ServiceExtraFormData>({
    resolver: zodResolver(require("../schema").serviceExtraSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

  const handleSubmit = (data: ServiceExtraFormData) => {
    if (editingExtra) {
      // Editar extra existente
      const updatedExtras = extras.map((extra) =>
        extra.id === editingExtra.id ? { ...data, id: extra.id } : extra
      );
      onExtrasChange(updatedExtras);
    } else {
      // Adicionar novo extra
      const newExtra: ServiceExtra = {
        ...data,
        id: Date.now().toString(), // ID temporário
      };
      onExtrasChange([...extras, newExtra]);
    }

    setIsDialogOpen(false);
    setEditingExtra(null);
    form.reset();
  };

  const handleEdit = (extra: ServiceExtra) => {
    setEditingExtra(extra);
    form.reset({
      name: extra.name,
      price: extra.price,
      description: extra.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (extraId: string) => {
    const updatedExtras = extras.filter((extra) => extra.id !== extraId);
    onExtrasChange(updatedExtras);
  };

  const openNewDialog = () => {
    setEditingExtra(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingExtra(null);
    form.reset();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Extras do Serviço</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openNewDialog}
          className="flex gap-2 items-center"
        >
          <Plus className="w-4 h-4" />
          Adicionar Extra
        </Button>
      </div>

      {extras.length === 0 ? (
        <div className="text-center py-4 text-sm text-gray-500">
          Nenhum extra cadastrado
        </div>
      ) : (
        <div className="space-y-2">
          {extras.map((extra) => (
            <div
              key={extra.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{extra.name}</span>
                  <Badge
                    variant="secondary"
                    className="flex gap-1 items-center"
                  >
                    <DollarSign className="w-3 h-3" />
                    {formatPrice(extra.price)}
                  </Badge>
                </div>
                {extra.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {extra.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(extra)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(extra.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingExtra ? "Editar Extra" : "Novo Extra"}
            </DialogTitle>
            <DialogDescription>
              {editingExtra
                ? "Atualize as informações do extra"
                : "Adicione um novo extra ao serviço"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Extra</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Tosa Bebê" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Adicional (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição do extra..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingExtra ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
