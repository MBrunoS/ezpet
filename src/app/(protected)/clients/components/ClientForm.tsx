"use client";

import React, { useState, useEffect } from "react";
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
import { clientSchema, ClientFormData, PetFormData } from "../schema";
import { Pet } from "@/types";
import { PetForm } from "./PetForm";
import { Plus, Users } from "lucide-react";
import {
  usePetsByClient,
  useAddPet,
  useUpdatePet,
  useDeletePet,
} from "@/hooks/queries/usePetsQuery";
import { ClientWithPets } from "@/types";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData, tempPets: Pet[]) => Promise<void>;
  clientInEdit: ClientWithPets | null;
  onPetAdded?: () => void;
  onPetRemoved?: () => void;
}

export function ClientForm({
  isOpen,
  onClose,
  onSubmit,
  clientInEdit,
  onPetAdded,
  onPetRemoved,
}: ClientFormProps) {
  // Estado local só para pets temporários de novo cliente
  const [tempPets, setTempPets] = useState<Pet[]>([]);
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const addPetMutation = useAddPet();
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();

  // Hook para buscar pets do cliente existente
  const { data: petsFromDb = [], isLoading: loadingPets } = usePetsByClient(
    clientInEdit?.id ?? ""
  );

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (clientInEdit && isOpen) {
      form.reset({
        name: clientInEdit.name,
        email: clientInEdit.email,
        phone: clientInEdit.phone,
        address: clientInEdit.address || "",
      });
    } else if (!clientInEdit && isOpen) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
      setTempPets([]);
    }
  }, [clientInEdit, isOpen, form]);

  // Pets a serem exibidos
  const pets = clientInEdit ? petsFromDb : tempPets;

  const handleSubmit = async (data: ClientFormData) => {
    // Para novo cliente, enviar pets temporários
    await onSubmit(data, tempPets);
  };

  const handleClose = () => {
    onClose();
    setTempPets([]);
    setShowPetForm(false);
    setEditingPet(null);
  };

  const handleSavePet = async (petData: PetFormData) => {
    if (editingPet) {
      // Atualizar pet existente
      if (clientInEdit) {
        updatePetMutation.mutate(
          { id: editingPet.id, data: petData },
          {
            onSuccess: () => {
              setEditingPet(null);
            },
          }
        );
      } else {
        // Atualizar pet temporário
        setTempPets((prev) =>
          prev.map((p) => (p.id === editingPet.id ? { ...p, ...petData } : p))
        );
        setEditingPet(null);
      }
    } else if (clientInEdit) {
      // Adicionar novo pet ao cliente existente
      addPetMutation.mutate(
        { ...petData, clientId: clientInEdit.id },
        {
          onSuccess: () => {
            onPetAdded?.();
          },
        }
      );
    } else {
      // Adicionar pet temporário (será salvo quando o cliente for criado)
      const tempPet: Pet = {
        id: `temp-${Date.now()}`,
        userId: "",
        clientId: "",
        ...petData,
      };
      setTempPets([...tempPets, tempPet]);
    }
    setShowPetForm(false);
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setShowPetForm(true);
  };

  const handleRemovePet = async (pet: Pet) => {
    if (pet.id.startsWith("temp-")) {
      // Remover pet temporário
      setTempPets(tempPets.filter((p) => p.id !== pet.id));
    } else if (clientInEdit) {
      // Remover pet do banco
      deletePetMutation.mutate(pet.id, {
        onSuccess: () => {
          onPetRemoved?.();
        },
      });
    }
  };

  const cancelPetForm = () => {
    setShowPetForm(false);
    setEditingPet(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {clientInEdit ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {clientInEdit
              ? "Atualize as informações do cliente"
              : "Adicione um novo cliente e seus pets"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Dados do Cliente */}
            <div className="space-y-4">
              <h3 className="flex gap-2 items-center text-lg font-semibold">
                <Users className="w-5 h-5" />
                Dados do Cliente
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="joao@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Endereço completo..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção de Pets */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pets ({pets.length})</h3>
                <Button
                  type="button"
                  onClick={() => setShowPetForm(true)}
                  className="flex gap-2 items-center"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Pet
                </Button>
              </div>

              {pets.length === 0 && !showPetForm && (
                <div className="py-8 text-center text-gray-500">
                  Nenhum pet cadastrado. Clique em "Adicionar Pet" para começar.
                </div>
              )}

              {/* Lista de Pets */}
              {pets.length > 0 && (
                <div className="space-y-3">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="flex justify-between items-center p-3 bg-white rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">{pet.name}</div>
                        <div className="text-sm text-gray-600">
                          {pet.species} • {pet.breed} • {pet.age} anos •{" "}
                          {pet.weight}kg
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPet(pet)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePet(pet)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulário de Pet */}
              {showPetForm && (
                <PetForm
                  pet={editingPet}
                  onSave={handleSavePet}
                  onCancel={cancelPetForm}
                />
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {clientInEdit ? "Atualizar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
