"use client";

import React, { useState, useEffect } from "react";
import { useClients } from "../../hooks/useClients";
import { usePets } from "../../hooks/usePets";
import { ClientWithPets, Pet } from "../../types";
import { Button } from "../../components/ui/button";
import { Plus, Users } from "lucide-react";
import {
  ClientForm,
  ClientTable,
  DeleteConfirmationDialog,
} from "./components";
import { ClientFormData } from "./schema";

export default function ClientsPage() {
  const {
    clients,
    loading: loadingClients,
    error: errorClients,
    addClient,
    updateClient,
    removeClient,
    incrementPetsCount,
    decrementPetsCount,
  } = useClients();
  const {
    pets,
    loading: loadingPets,
    error: errorPets,
    loadPetsByClient,
    addPet,
  } = usePets();
  const [clientsWithPets, setClientsWithPets] = useState<ClientWithPets[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientInEdit, setClientInEdit] = useState<ClientWithPets | null>(null);
  const [clientToDelete, setClientToDelete] = useState<ClientWithPets | null>(
    null
  );

  // Carregar pets para cada cliente (apenas quando necessário)
  useEffect(() => {
    const loadPetsForClients = async () => {
      const clientsWithPetsData = await Promise.all(
        clients.map(async (client) => {
          // Só carrega pets se o cliente tiver pets ou estiver sendo editado
          let pets: Pet[] = [];
          if (client.petsCount > 0 || clientInEdit?.id === client.id) {
            pets = await loadPetsByClient(client.id);
          }
          return {
            ...client,
            pets,
          };
        })
      );
      setClientsWithPets(clientsWithPetsData);
    };

    if (clients.length > 0) {
      loadPetsForClients();
    } else {
      setClientsWithPets([]);
    }
  }, [clients, clientInEdit?.id]);

  const handleSubmit = async (data: ClientFormData, tempPets: Pet[] = []) => {
    if (clientInEdit) {
      const success = await updateClient(clientInEdit.id, data);
      if (success) {
        setIsDialogOpen(false);
        setClientInEdit(null);
      }
    } else {
      const newClientId = await addClient(data);
      if (newClientId) {
        // Salvar os pets temporários para o novo cliente
        if (tempPets.length > 0) {
          // Salvar cada pet temporário
          for (const tempPet of tempPets) {
            if (tempPet.id.startsWith("temp-")) {
              const { id, clientId, ...petData } = tempPet;
              await addPet(
                { ...petData, clientId: newClientId },
                newClientId,
                () => {
                  incrementPetsCount(newClientId);
                }
              );
            }
          }
        }
        setIsDialogOpen(false);
      }
    }
  };

  const handleEdit = (client: ClientWithPets) => {
    setClientInEdit(client);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (clientToDelete) {
      await removeClient(clientToDelete.id);
      setClientToDelete(null);
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
      incrementPetsCount(clientInEdit.id);
    }
  };

  const handlePetRemoved = () => {
    if (clientInEdit) {
      decrementPetsCount(clientInEdit.id);
    }
  };

  const loading = loadingClients || loadingPets;
  const error = errorClients || errorPets;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Erro: {error}</div>
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
              Clientes ({clientsWithPets.length})
            </h2>
          </div>

          <ClientTable
            clients={clientsWithPets}
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
