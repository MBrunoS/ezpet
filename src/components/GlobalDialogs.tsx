"use client";

import React from "react";
import { useDialog } from "@/contexts/DialogContext";
import { ProductForm } from "@/app/(protected)/stock/components/ProductForm";
import { StockMovementForm } from "@/app/(protected)/stock/components/StockMovementForm";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { ClientForm } from "@/app/(protected)/clients/components/ClientForm";
import { ServiceForm } from "@/app/(protected)/services/components/ServiceForm";
import { AppointmentForm } from "@/app/(protected)/appointments/components/AppointmentForm";
import { AppointmentDetailsDialog } from "@/components/ui/appointment-details-dialog";
import {
  useStock,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  useStockMovement,
} from "@/hooks/queries/useStockQuery";
import {
  useClients,
  useAddClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/queries/useClientsQuery";
import {
  useServices,
  useAddService,
  useUpdateService,
  useDeleteService,
} from "@/hooks/queries/useServicesQuery";
import {
  useAppointments,
  useAddAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/queries/useAppointmentsQuery";
import {
  ProductFormData,
  StockMovementFormData,
} from "@/app/(protected)/stock/schema";
import { ClientFormData } from "@/app/(protected)/clients/schema";
import { ServiceFormData } from "@/app/(protected)/services/schema";
import { AppointmentFormData } from "@/app/(protected)/appointments/schema";
import { toast } from "sonner";
import {
  ProductFormPayload,
  ClientFormPayload,
  ServiceFormPayload,
  DeleteConfirmationPayload,
  StockMovementFormPayload,
  AppointmentDetailsPayload,
  AppointmentFormPayload,
} from "@/contexts/DialogContext";
import { usePets } from "@/hooks/queries/usePetsQuery";

// Type guards
function isProductFormPayload(data: any): data is ProductFormPayload {
  return data && typeof data === "object" && "product" in data;
}

function isClientFormPayload(data: any): data is ClientFormPayload {
  return data && typeof data === "object" && "client" in data;
}

function isServiceFormPayload(data: any): data is ServiceFormPayload {
  return data && typeof data === "object" && "service" in data;
}

function isDeleteConfirmationPayload(
  data: any
): data is DeleteConfirmationPayload {
  return (
    data &&
    typeof data === "object" &&
    "id" in data &&
    "name" in data &&
    "type" in data
  );
}

function isStockMovementFormPayload(
  data: any
): data is StockMovementFormPayload {
  return data && typeof data === "object" && "product" in data;
}

function isAppointmentDetailsPayload(
  data: any
): data is AppointmentDetailsPayload {
  return data && typeof data === "object" && "appointment" in data;
}

function isAppointmentFormPayload(data: any): data is AppointmentFormPayload {
  return data && typeof data === "object" && "appointment" in data;
}

export function GlobalDialogs() {
  const { state, closeDialog, openDialog } = useDialog();
  const { data: products } = useStock();
  const { data: clients } = useClients();
  const { data: services } = useServices();
  const { data: appointments } = useAppointments();
  const { data: pets, isLoading: loadingPets } = usePets();

  // Stock mutations
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const stockMovementMutation = useStockMovement();

  // Client mutations
  const addClientMutation = useAddClient();
  const updateClientMutation = useUpdateClient();

  // Service mutations
  const addServiceMutation = useAddService();
  const updateServiceMutation = useUpdateService();

  // Appointment mutations
  const addAppointmentMutation = useAddAppointment();
  const updateAppointmentMutation = useUpdateAppointment();
  const deleteAppointmentMutation = useDeleteAppointment();

  // Handlers
  const handleProductSubmit = async (data: ProductFormData) => {
    if (!isProductFormPayload(state.data)) {
      console.error("Invalid product form payload");
      return;
    }

    const product = state.data.product;

    if (product) {
      updateProductMutation.mutate(
        { id: product.id, data },
        {
          onSuccess: () => {
            closeDialog();
          },
        }
      );
    } else {
      addProductMutation.mutate(data, {
        onSuccess: () => {
          closeDialog();
        },
      });
    }
  };

  const handleClientSubmit = async (
    data: ClientFormData,
    tempPets: any[] = []
  ) => {
    if (!isClientFormPayload(state.data)) {
      console.error("Invalid client form payload");
      return;
    }

    const client = state.data.client;

    if (client) {
      updateClientMutation.mutate(
        { id: client.id, data },
        {
          onSuccess: () => {
            closeDialog();
          },
        }
      );
    } else {
      addClientMutation.mutate(data, {
        onSuccess: (docRef) => {
          // Salvar pets temporários se houver
          if (tempPets.length > 0 && docRef) {
            // TODO: Implementar salvamento de pets
          }
          closeDialog();
        },
      });
    }
  };

  const handleServiceSubmit = async (data: ServiceFormData) => {
    if (!isServiceFormPayload(state.data)) {
      console.error("Invalid service form payload");
      return;
    }

    const service = state.data.service;

    if (service) {
      updateServiceMutation.mutate(
        { id: service.id, data },
        {
          onSuccess: () => {
            closeDialog();
          },
        }
      );
    } else {
      addServiceMutation.mutate(data, {
        onSuccess: () => {
          closeDialog();
        },
      });
    }
  };

  const handleAppointmentSubmit = async (data: AppointmentFormData) => {
    if (!isAppointmentFormPayload(state.data)) {
      console.error("Invalid appointment form payload");
      return;
    }

    const appointment = state.data.appointment;

    if (appointment) {
      updateAppointmentMutation.mutate(
        { id: appointment.id, data },
        {
          onSuccess: () => {
            closeDialog();
          },
        }
      );
    } else {
      // Buscar informações do serviço para calcular o preço
      const service = services?.find((s) => s.id === data.serviceId);
      const extrasPrice = (data.selectedExtras || []).reduce(
        (sum, extra) => sum + extra.price,
        0
      );
      const totalPrice = service ? service.price + extrasPrice : 0;

      const appointmentData = {
        ...data,
        price: totalPrice,
        status: "scheduled" as const,
      };

      addAppointmentMutation.mutate(appointmentData, {
        onSuccess: () => {
          closeDialog();
        },
      });
    }
  };

  const handleMovementSubmit = async (data: StockMovementFormData) => {
    const selectedProduct = products?.find((p) => p.id === data.productId);
    if (!selectedProduct) return;

    stockMovementMutation.mutate(
      {
        productId: data.productId,
        productName: selectedProduct.name,
        type: data.type,
        quantity: data.quantity,
        reason: data.reason,
        observation: data.observation,
      },
      {
        onSuccess: () => {
          closeDialog();
        },
      }
    );
  };

  const handleDelete = () => {
    if (!isDeleteConfirmationPayload(state.data)) {
      console.error("Invalid delete confirmation payload");
      return;
    }

    // Executar callback de confirmação se fornecido
    if (state.data.onConfirm) {
      state.data.onConfirm();
      closeDialog(); // Fechar o diálogo após executar o callback
    } else {
      // Se não há callback, apenas fechar o diálogo
      console.warn("No onConfirm callback provided for delete confirmation");
      closeDialog();
    }
  };

  const handleAppointmentEdit = (appointment: any) => {
    // Fechar o diálogo de detalhes e abrir o formulário de edição
    closeDialog();
    openDialog("appointment-form", { appointment });
  };

  const handleAppointmentDelete = (appointment: any) => {
    // Fechar o diálogo de detalhes e abrir confirmação de exclusão
    closeDialog();
    openDialog("delete-confirmation", {
      id: appointment.id,
      name: `Agendamento ${appointment.id}`,
      type: "agendamento",
      onConfirm: () => {
        deleteAppointmentMutation.mutate(appointment.id, {
          onSuccess: () => {
            closeDialog();
          },
        });
      },
    });
  };

  // Render dialogs based on state
  if (!state.isOpen) return null;

  switch (state.type) {
    case "product-form":
      if (!isProductFormPayload(state.data)) {
        console.error("Invalid product form payload");
        return null;
      }
      return (
        <ProductForm
          isOpen={state.isOpen}
          onClose={closeDialog}
          onSubmit={handleProductSubmit}
          product={state.data.product}
        />
      );

    case "client-form":
      if (!isClientFormPayload(state.data)) {
        console.error("Invalid client form payload");
        return null;
      }
      return (
        <ClientForm
          isOpen={state.isOpen}
          onClose={closeDialog}
          onSubmit={handleClientSubmit}
          clientInEdit={state.data.client || null}
        />
      );

    case "service-form":
      if (!isServiceFormPayload(state.data)) {
        console.error("Invalid service form payload");
        return null;
      }
      return (
        <ServiceForm
          isOpen={state.isOpen}
          onClose={closeDialog}
          onSubmit={handleServiceSubmit}
          serviceInEdit={state.data.service || null}
        />
      );

    case "appointment-details":
      if (!isAppointmentDetailsPayload(state.data)) {
        console.error("Invalid appointment details payload");
        return null;
      }

      // Sempre mostrar detalhes do agendamento
      return (
        <AppointmentDetailsDialog
          appointment={state.data.appointment}
          isOpen={state.isOpen}
          onClose={closeDialog}
          onEdit={handleAppointmentEdit}
          onDelete={handleAppointmentDelete}
        />
      );

    case "appointment-form":
      if (!isAppointmentFormPayload(state.data)) {
        console.error("Invalid appointment form payload");
        return null;
      }
      return (
        <AppointmentForm
          isOpen={state.isOpen}
          onClose={closeDialog}
          onSubmit={handleAppointmentSubmit}
          appointmentInEdit={state.data.appointment || null}
          clients={clients || []}
          pets={pets || []}
          loadingPets={loadingPets}
        />
      );

    case "stock-movement-form":
      if (!isStockMovementFormPayload(state.data)) {
        console.error("Invalid stock movement form payload");
        return null;
      }
      return (
        <StockMovementForm
          isOpen={state.isOpen}
          onClose={closeDialog}
          onSubmit={handleMovementSubmit}
          products={products || []}
          preselectedProduct={state.data.product}
        />
      );

    case "delete-confirmation":
      if (!isDeleteConfirmationPayload(state.data)) {
        console.error("Invalid delete confirmation payload");
        return null;
      }
      return (
        <DeleteConfirmationDialog
          item={state.data}
          isOpen={state.isOpen}
          onConfirm={handleDelete}
          onClose={closeDialog}
        />
      );

    case "pet-form":
      // TODO: Implement pet form dialog
      console.warn("Pet form dialog not implemented yet");
      return null;

    default:
      return null;
  }
}
