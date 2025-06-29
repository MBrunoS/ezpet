"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Product, Client, Service, Pet } from "@/types";

// Re-export Product for convenience
export type { Product } from "@/types";

// Tipos de dialogs disponíveis
export type DialogType =
  | "product-form"
  | "client-form"
  | "service-form"
  | "pet-form"
  | "delete-confirmation"
  | "stock-movement-form"
  | "appointment-form"
  | "appointment-details";

// Payloads específicos para cada tipo de dialog
export interface ProductFormPayload {
  product?: Product;
}

export interface ClientFormPayload {
  client?: Client;
}

export interface ServiceFormPayload {
  service?: Service;
}

export interface PetFormPayload {
  pet?: Pet;
}

export interface DeleteConfirmationPayload {
  id: string;
  name: string;
  type: string;
  onConfirm?: () => void;
}

export interface StockMovementFormPayload {
  product?: Product;
}

export interface AppointmentDetailsPayload {
  appointment: any; // TODO: Tipar quando Appointment for implementado
}

export interface AppointmentFormPayload {
  appointment?: any; // TODO: Tipar quando Appointment for implementado
}

// Union type para todos os payloads
export type DialogPayload =
  | ProductFormPayload
  | ClientFormPayload
  | ServiceFormPayload
  | PetFormPayload
  | DeleteConfirmationPayload
  | StockMovementFormPayload
  | AppointmentDetailsPayload
  | AppointmentFormPayload
  | null;

// Estado do dialog
interface DialogState {
  type: DialogType | null;
  isOpen: boolean;
  data: DialogPayload;
}

// Ações do reducer com tipagem específica
type DialogAction =
  | { type: "OPEN_DIALOG"; payload: { type: DialogType; data?: DialogPayload } }
  | { type: "CLOSE_DIALOG" }
  | { type: "SET_DIALOG_DATA"; payload: DialogPayload };

// Estado inicial
const initialState: DialogState = {
  type: null,
  isOpen: false,
  data: null,
};

// Reducer
function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case "OPEN_DIALOG":
      return {
        type: action.payload.type,
        isOpen: true,
        data: action.payload.data || null,
      };
    case "CLOSE_DIALOG":
      return {
        type: null,
        isOpen: false,
        data: null,
      };
    case "SET_DIALOG_DATA":
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}

// Context
interface DialogContextType {
  state: DialogState;
  openDialog: (type: DialogType, data?: DialogPayload) => void;
  closeDialog: () => void;
  setDialogData: (data: DialogPayload) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Provider
interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [state, dispatch] = useReducer(dialogReducer, initialState);

  const openDialog = (type: DialogType, data?: DialogPayload) => {
    dispatch({ type: "OPEN_DIALOG", payload: { type, data } });
  };

  const closeDialog = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };

  const setDialogData = (data: DialogPayload) => {
    dispatch({ type: "SET_DIALOG_DATA", payload: data });
  };

  return (
    <DialogContext.Provider
      value={{ state, openDialog, closeDialog, setDialogData }}
    >
      {children}
    </DialogContext.Provider>
  );
}

// Hook personalizado
export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

// Hook personalizado com helpers tipados
export function useDialogActions() {
  const { openDialog } = useDialog();

  return {
    openProductForm: (product?: Product) => {
      openDialog("product-form", { product });
    },
    openClientForm: (client?: Client) => {
      openDialog("client-form", { client });
    },
    openServiceForm: (service?: Service) => {
      openDialog("service-form", { service });
    },
    openPetForm: (pet?: Pet) => {
      openDialog("pet-form", { pet });
    },
    openDeleteConfirmation: (payload: DeleteConfirmationPayload) => {
      openDialog("delete-confirmation", payload);
    },
    openStockMovementForm: (product?: Product) => {
      openDialog("stock-movement-form", { product });
    },
    openAppointmentDetails: (appointment: any) => {
      openDialog("appointment-details", { appointment });
    },
    openAppointmentForm: (appointment?: any) => {
      openDialog("appointment-form", { appointment });
    },
  };
}
