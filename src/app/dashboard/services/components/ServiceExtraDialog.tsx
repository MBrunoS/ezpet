"use client";

import React, { useState, useEffect } from "react";
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
import { ServiceExtra } from "@/types";
import { ServiceExtraFormData, serviceExtraSchema } from "../schema";

interface ServiceExtraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceExtraFormData) => void;
  editingExtra: ServiceExtra | null;
}

export function ServiceExtraDialog({
  isOpen,
  onClose,
  onSubmit,
  editingExtra,
}: ServiceExtraDialogProps) {
  const form = useForm<ServiceExtraFormData>({
    resolver: zodResolver(serviceExtraSchema),
    defaultValues: {
      id: "",
      name: "",
      price: 0,
      description: "",
    },
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingExtra && isOpen) {
      form.reset({
        id: editingExtra.id,
        name: editingExtra.name,
        price: editingExtra.price,
        description: editingExtra.description || "",
      });
    } else if (!editingExtra && isOpen) {
      form.reset({
        id: "",
        name: "",
        price: 0,
        description: "",
      });
    }
  }, [editingExtra, isOpen, form]);

  const handleSubmit = (data: ServiceExtraFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              <Button type="button" variant="outline" onClick={handleClose}>
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
  );
}
