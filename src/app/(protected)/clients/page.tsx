"use client";

import React, { useState, useMemo } from "react";
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
import { ClientForm, ClientTable, ClientFilters } from "./components";
import { ClientFormData } from "./schema";
import { useDialog } from "@/contexts/DialogContext";

export default function ClientsPage() {
  const { data: clients, isLoading: loadingClients } = useClients();
  const [searchTerm, setSearchTerm] = useState("");

  const addClientMutation = useAddClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const incrementPetsCountMutation = useIncrementPetsCount();
  const decrementPetsCountMutation = useDecrementPetsCount();

  const addPetMutation = useAddPet();
  const deletePetMutation = useDeletePet();

  const { openDialog, closeDialog } = useDialog();

  // Filtrar clientes baseado no termo de pesquisa
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!searchTerm.trim()) return clients;

    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleSubmit = async (data: ClientFormData, tempPets: Pet[] = []) => {
    // O clientInEdit será passado via contexto do GlobalDialogs
    // Esta função será chamada pelo ClientForm que já tem acesso ao clientInEdit

    // Criando novo cliente
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
        closeDialog();
      },
    });
  };

  const handleEdit = (client: Client) => {
    openDialog("client-form", { client });
  };

  const handleDelete = (client: Client) => {
    deleteClientMutation.mutate(client.id, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  const openNewDialog = () => {
    openDialog("client-form", { client: undefined });
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
              Clientes ({filteredClients.length || 0})
            </h2>
          </div>

          <div className="mb-4">
            <ClientFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          <ClientTable
            clients={filteredClients}
            onEdit={handleEdit}
            onDelete={(client) =>
              openDialog("delete-confirmation", {
                id: client.id,
                name: client.name,
                type: "cliente",
                onConfirm: () => handleDelete(client),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
