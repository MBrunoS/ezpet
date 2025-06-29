"use client";

import React from "react";
import {
  useServices,
  useAddService,
  useUpdateService,
  useDeleteService,
} from "@/hooks/queries/useServicesQuery";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { ServiceForm } from "./components/ServiceForm";
import { ServiceTable } from "./components/ServiceTable";
import { ServiceFormData } from "./schema";
import { useDialog } from "@/contexts/DialogContext";

export default function ServicesPage() {
  const { data: services, isLoading, error } = useServices();
  const addServiceMutation = useAddService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const { openDialog, closeDialog } = useDialog();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  const handleSubmit = async (data: ServiceFormData) => {
    // O service será passado via contexto do GlobalDialogs
    // Esta função será chamada pelo ServiceForm que já tem acesso ao service

    // Criando novo serviço
    addServiceMutation.mutate(data, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  const handleEdit = (service: Service) => {
    openDialog("service-form", { service });
  };

  const handleDelete = (service: Service) => {
    deleteServiceMutation.mutate(service.id, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  const openNewDialog = () => {
    openDialog("service-form", { service: undefined });
  };

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
              Serviços ({services?.length || 0})
            </h2>
          </div>

          <ServiceTable
            services={services || []}
            onEdit={handleEdit}
            onDelete={(service) =>
              openDialog("delete-confirmation", {
                id: service.id,
                name: service.name,
                type: "serviço",
                onConfirm: () => handleDelete(service),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
