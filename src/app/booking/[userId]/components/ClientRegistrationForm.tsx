"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  MapPin,
  PawPrint,
  Plus,
  Trash2,
  ArrowLeft,
  Phone,
  Mail,
  Search,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useAddClientPublic, useManualClientSearch } from "@/hooks/queries";
import { Client } from "@/types";
import { Label } from "@/components/ui/label";

interface ClientRegistrationFormProps {
  userId: string;
  onClientRegistered: (client: Client) => void;
  onBack: () => void;
}

const clientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    zipCode: z.string().min(1, "CEP é obrigatório"),
  }),
});

type ClientFormData = z.infer<typeof clientSchema>;

export function ClientRegistrationForm({
  userId,
  onClientRegistered,
  onBack,
}: ClientRegistrationFormProps) {
  const [searchMode, setSearchMode] = useState<"search" | "register">("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const addClientMutation = useAddClientPublic(userId);
  const searchClientMutation = useManualClientSearch();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Digite um telefone ou email para buscar");
      return;
    }

    setIsSearching(true);
    try {
      const client = await searchClientMutation.mutateAsync({
        userId,
        phoneOrEmail: searchTerm.trim(),
      });

      if (client) {
        toast.success("Cliente encontrado!");
        onClientRegistered(client);
      } else {
        toast.error(
          "Cliente não encontrado. Você pode cadastrar um novo cliente."
        );
        setSearchMode("register");
        form.reset();
      }
    } catch (error) {
      toast.error("Erro ao buscar cliente");
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      const result = await addClientMutation.mutateAsync(data);
      const newClient: Client = {
        id: result.id,
        ...data,
        userId: userId,
        petsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      toast.success("Cliente cadastrado com sucesso!");
      onClientRegistered(newClient);
    } catch (error) {
      // Erro já tratado pela mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex gap-2 items-center"
        >
          ← Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Autoagendamento</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <User className="w-5 h-5" />
            {searchMode === "search"
              ? "Buscar Cliente"
              : "Cadastrar Novo Cliente"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {searchMode === "search" ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Telefone ou Email</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Digite telefone ou email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || searchClientMutation.isPending}
                    className="flex gap-2 items-center"
                  >
                    <Search className="w-4 h-4" />
                    {searchClientMutation.isPending ? "Buscando..." : "Buscar"}
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="mb-3 text-sm text-gray-600">
                  Não encontrou seu cliente? Cadastre um novo:
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchMode("register")}
                  className="flex gap-2 items-center"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar Novo Cliente
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Digite o email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o telefone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Endereço */}
                <div className="pt-4 space-y-4 border-t">
                  <h4 className="font-medium">Endereço</h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da rua" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input placeholder="Apto, bloco, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="SP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.zipCode"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSearchMode("search")}
                    className="flex-1"
                  >
                    Voltar para Busca
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting || addClientMutation.isPending
                    }
                    className="flex-1"
                  >
                    {addClientMutation.isPending
                      ? "Cadastrando..."
                      : "Cadastrar Cliente"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
