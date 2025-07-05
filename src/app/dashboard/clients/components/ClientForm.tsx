"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { clientSchema, ClientFormData, PetFormData } from "../schema";
import { Pet } from "@/types";
import { PetDialog } from "./PetDialog";
import { ClientDataSection } from "./ClientDataSection";
import { ClientAddressSection } from "./ClientAddressSection";
import { PetsSection } from "./PetsSection";
import {
  usePetsByClient,
  useAddPet,
  useUpdatePet,
  useDeletePet,
} from "@/hooks/queries/usePetsQuery";
import { Client } from "@/types";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData, tempPets: Pet[]) => Promise<void>;
  clientInEdit: Client | null;
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
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
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
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
  });

  const registerWithMask = useHookFormMask(form.register);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (clientInEdit && isOpen) {
      form.reset({
        name: clientInEdit.name,
        email: clientInEdit.email,
        phone: clientInEdit.phone,
        address: clientInEdit.address || {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
        },
      });
    } else if (!clientInEdit && isOpen) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
        },
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
    setIsPetDialogOpen(false);
    setEditingPet(null);
  };

  const handlePetSubmit = async (petData: PetFormData) => {
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
    setIsPetDialogOpen(false);
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setIsPetDialogOpen(true);
  };

  const handleRemovePet = async (pet: Pet) => {
    if (pet.id.startsWith("temp-")) {
      // Remover pet temporário
      setTempPets(tempPets.filter((p) => p.id !== pet.id));
    } else if (clientInEdit) {
      // Remover pet do banco
      deletePetMutation.mutate(
        { id: pet.id, clientId: clientInEdit.id },
        {
          onSuccess: () => {
            onPetRemoved?.();
          },
        }
      );
    }
  };

  const handlePetDialogClose = () => {
    setIsPetDialogOpen(false);
    setEditingPet(null);
  };

  const handleAddPet = () => {
    setEditingPet(null);
    setIsPetDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
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
              className="overflow-y-auto flex-1 pr-2 space-y-6"
            >
              <ClientDataSection
                control={form.control}
                registerWithMask={registerWithMask}
              />

              <ClientAddressSection
                control={form.control}
                registerWithMask={registerWithMask}
              />

              <PetsSection
                pets={pets}
                onAddPet={handleAddPet}
                onEditPet={handleEditPet}
                onRemovePet={handleRemovePet}
              />
            </form>
          </Form>

          <DialogFooter className="gap-3 pt-3 mt-3 border-t">
            <div className="flex flex-col gap-2 justify-end mt-2 sm:flex-row">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                {clientInEdit ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PetDialog
        isOpen={isPetDialogOpen}
        onClose={handlePetDialogClose}
        onSubmit={handlePetSubmit}
        editingPet={editingPet}
      />
    </>
  );
}
