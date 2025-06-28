"use client";

import React, { useState } from "react";
import {
  useClients,
  useAddClient,
  useUpdateClient,
  useDeleteClient,
  useIncrementPetsCount,
  useDecrementPetsCount,
} from "@/hooks/queries/useClientsQuery";
import { useAddPet, useDeletePet } from "@/hooks/queries/usePetsQuery";
import { Client, Pet } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import {
  ClientForm,
  ClientTable,
  DeleteConfirmationDialog,
} from "./components";
import { ClientFormData } from "./schema";

export default function ClientsPage() {
  const { data: clients, isLoading: loadingClients } = useClients();
  const addClientMutation = useAddClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const incrementPetsCountMutation = useIncrementPetsCount();
  const decrementPetsCountMutation = useDecrementPetsCount();

  const addPetMutation = useAddPet();
  const deletePetMutation = useDeletePet();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientInEdit, setClientInEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const handleSubmit = async (data: ClientFormData, tempPets: Pet[] = []) => {
    if (clientInEdit) {
      updateClientMutation.mutate(
        { id: clientInEdit.id, data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setClientInEdit(null);
          },
        }
      );
    } else {
      addClientMutation.mutate(data, {
        onSuccess: (docRef) => {
          // Salvar os pets temporários para o novo cliente
          if (tempPets.length > 0 && docRef) {
            const newClientId = docRef.id;
            // Salvar cada pet temporário
            for (const tempPet of tempPets) {
              if (tempPet.id.startsWith("temp-")) {
                const { id, clientId, ...petData } = tempPet;
                addPetMutation.mutate(
                  { ...petData, clientId: newClientId },
                  {
                    onSuccess: () => {
                      incrementPetsCountMutation.mutate(newClientId);
                    },
                  }
                );
              }
            }
          }
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleEdit = (client: Client) => {
    setClientInEdit(client);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (clientToDelete) {
      deleteClientMutation.mutate(clientToDelete.id, {
        onSuccess: () => {
          setClientToDelete(null);
        },
      });
    }
  };

  const openNewDialog = () => {
    setClientInEdit(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setClientInEdit(null);
  };

  // Funções wrapper para capturar o clientId
  const handlePetAdded = () => {
    if (clientInEdit) {
      incrementPetsCountMutation.mutate(clientInEdit.id);
    }
  };

  const handlePetRemoved = () => {
    if (clientInEdit) {
      decrementPetsCountMutation.mutate(clientInEdit.id);
    }
  };

  if (loadingClients) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie os clientes e seus pets</p>
        </div>
        <Button onClick={openNewDialog} className="flex gap-2 items-center">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex gap-2 items-center mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              Clientes ({clients?.length || 0})
            </h2>
          </div>

          <ClientTable
            clients={clients || []}
            onEdit={handleEdit}
            onDelete={setClientToDelete}
          />
        </div>
      </div>

      <ClientForm
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        clientInEdit={clientInEdit}
        onPetAdded={handlePetAdded}
        onPetRemoved={handlePetRemoved}
      />

      <DeleteConfirmationDialog
        client={clientToDelete}
        onConfirm={handleDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
}
