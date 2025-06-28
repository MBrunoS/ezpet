"use client";

import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { ClientFormData } from "../schema";

interface ClientDataSectionProps {
  control: Control<ClientFormData>;
  registerWithMask: any;
}

export function ClientDataSection({
  control,
  registerWithMask,
}: ClientDataSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="flex gap-2 items-center text-lg font-semibold">
        <Users className="w-5 h-5" />
        Dados do Cliente
      </h3>

      {/* Nome Completo - Ocupa toda a linha */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Ex: João Silva" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email e Telefone - Dividem a linha (exceto mobile) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="joao@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="(99) 99999-9999"
                  {...registerWithMask("phone", ["(99) 99999-9999"])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
