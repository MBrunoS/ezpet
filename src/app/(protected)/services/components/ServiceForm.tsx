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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings, DollarSign, Clock } from "lucide-react";
import { Service } from "@/types";
import { serviceSchema, ServiceFormData } from "../schema";
import { ServiceExtras } from "./ServiceExtras";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  serviceInEdit: Service | null;
}

export function ServiceForm({
  isOpen,
  onClose,
  onSubmit,
  serviceInEdit,
}: ServiceFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 60,
      extras: [],
      isActive: true,
    },
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (serviceInEdit && isOpen) {
      form.reset({
        name: serviceInEdit.name,
        description: serviceInEdit.description || "",
        price: serviceInEdit.price,
        duration: serviceInEdit.duration,
        extras: serviceInEdit.extras || [],
        isActive: serviceInEdit.isActive,
      });
    } else if (!serviceInEdit && isOpen) {
      form.reset({
        name: "",
        description: "",
        price: 0,
        duration: 60,
        extras: [],
        isActive: true,
      });
    }
  }, [serviceInEdit, isOpen, form]);

  const handleSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {serviceInEdit ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
          <DialogDescription>
            {serviceInEdit
              ? "Atualize as informações do serviço"
              : "Adicione um novo serviço"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Nome do Serviço */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 items-center">
                    <Settings className="w-4 h-4" />
                    Nome do Serviço
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Banho e Tosa"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preço e Duração */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-2 items-center">
                      <DollarSign className="w-4 h-4" />
                      Preço (R$)
                    </FormLabel>
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
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-2 items-center">
                      <Clock className="w-4 h-4" />
                      Duração (min)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        max="480"
                        placeholder="60"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 60)
                        }
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição detalhada do serviço..."
                      className="resize-none"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ativo/Inativo */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Serviço Ativo</FormLabel>
                    <div className="text-sm text-gray-500">
                      Serviços inativos não aparecem nos agendamentos
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Extras do Serviço */}
            <div className="space-y-4">
              <ServiceExtras
                extras={form.watch("extras")}
                onExtrasChange={(extras) => form.setValue("extras", extras)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Salvando..."
                  : serviceInEdit
                  ? "Atualizar Serviço"
                  : "Criar Serviço"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
