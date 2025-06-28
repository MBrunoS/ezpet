"use client";

import React, { useState } from "react";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { ServiceForm } from "./components/ServiceForm";
import { ServiceTable } from "./components/ServiceTable";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { ServiceFormData } from "./schema";

export default function ServicesPage() {
  const {
    services,
    loading: loadingServices,
    error: errorServices,
    addService,
    updateService,
    removeService,
  } = useServices();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serviceInEdit, setServiceInEdit] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const handleSubmit = async (data: ServiceFormData) => {
    if (serviceInEdit) {
      const success = await updateService(serviceInEdit.id, data);
      if (success) {
        setIsDialogOpen(false);
        setServiceInEdit(null);
      }
    } else {
      const success = await addService(data);
      if (success) {
        setIsDialogOpen(false);
      }
    }
  };

  const handleEdit = (service: Service) => {
    setServiceInEdit(service);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (serviceToDelete) {
      await removeService(serviceToDelete.id);
      setServiceToDelete(null);
    }
  };

  const openNewDialog = () => {
    setServiceInEdit(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setServiceInEdit(null);
  };

  if (loadingServices) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando serviços...</div>
      </div>
    );
  }

  if (errorServices) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Erro: {errorServices}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços oferecidos</p>
        </div>
        <Button onClick={openNewDialog} className="flex gap-2 items-center">
          <Plus className="w-4 h-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex gap-2 items-center mb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              Serviços ({services.length})
            </h2>
          </div>

          <ServiceTable
            services={services}
            onEdit={handleEdit}
            onDelete={setServiceToDelete}
          />
        </div>
      </div>

      <ServiceForm
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        serviceInEdit={serviceInEdit}
      />

      <DeleteConfirmationDialog
        service={serviceToDelete}
        onConfirm={handleDelete}
        onCancel={() => setServiceToDelete(null)}
      />
    </div>
  );
}
