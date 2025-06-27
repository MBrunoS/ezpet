"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Calendar, Clock, Users, PawPrint } from "lucide-react";
import { Appointment, Client, Pet } from "../../../types";
import {
  appointmentSchema,
  AppointmentFormData,
  serviceTypes,
  timeSlots,
} from "../schema";

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  appointmentInEdit: Appointment | null;
  clients: Client[];
  clientPets: Pet[];
  onClientChange: (clientId: string) => Promise<void>;
  selectedClient: Client | null;
  checkTimeSlotAvailability: (
    date: Date,
    excludeId?: string
  ) => Promise<boolean>;
}

export function AppointmentForm({
  isOpen,
  onClose,
  onSubmit,
  appointmentInEdit,
  clients,
  clientPets,
  onClientChange,
  selectedClient,
  checkTimeSlotAvailability,
}: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: "",
      petId: "",
      serviceType: "",
      date: "",
      time: "",
      observations: "",
    },
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (appointmentInEdit && isOpen) {
      const appointmentDate = appointmentInEdit.date;
      const dateStr = appointmentDate.toISOString().split("T")[0];
      const timeStr = appointmentDate.toTimeString().slice(0, 5);

      form.reset({
        clientId: appointmentInEdit.clientId,
        petId: appointmentInEdit.petId,
        serviceType: appointmentInEdit.service,
        date: dateStr,
        time: timeStr,
        observations: appointmentInEdit.observations || "",
      });
    } else if (!appointmentInEdit && isOpen) {
      form.reset({
        clientId: "",
        petId: "",
        serviceType: "",
        date: "",
        time: "",
        observations: "",
      });
    }
  }, [appointmentInEdit, isOpen, form]);

  // Verificar horários disponíveis quando a data mudar
  useEffect(() => {
    const date = form.watch("date");
    if (date) {
      checkAvailableTimeSlots(date);
    }
  }, [form.watch("date")]);

  const checkAvailableTimeSlots = async (date: string) => {
    const availableSlots: string[] = [];

    for (const timeSlot of timeSlots) {
      const appointmentDate = new Date(`${date}T${timeSlot}`);
      const isAvailable = await checkTimeSlotAvailability(
        appointmentDate,
        appointmentInEdit?.id
      );
      if (isAvailable) {
        availableSlots.push(timeSlot);
      }
    }

    setAvailableTimeSlots(availableSlots);
  };

  const handleSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = async (clientId: string) => {
    form.setValue("clientId", clientId);
    form.setValue("petId", ""); // Reset pet selection
    await onClientChange(clientId);
  };

  const handleClose = () => {
    onClose();
    setAvailableTimeSlots([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointmentInEdit ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
          <DialogDescription>
            {appointmentInEdit
              ? "Atualize as informações do agendamento"
              : "Agende um novo serviço para um pet"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Seleção de Cliente */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 items-center">
                    <Users className="w-4 h-4" />
                    Cliente
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleClientChange}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} - {client.phone}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-clients" disabled>
                          Nenhum cliente cadastrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seleção de Pet */}
            <FormField
              control={form.control}
              name="petId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 items-center">
                    <PawPrint className="w-4 h-4" />
                    Pet
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading || !selectedClient}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um pet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientPets.length > 0 ? (
                        clientPets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name} ({pet.species} - {pet.breed})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-pets" disabled>
                          {selectedClient
                            ? "Nenhum pet cadastrado"
                            : "Selecione um cliente primeiro"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Serviço */}
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Serviço</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-2 items-center">
                      <Calendar className="w-4 h-4" />
                      Data
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={loading}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-2 items-center">
                      <Clock className="w-4 h-4" />
                      Horário
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading || !form.watch("date")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimeSlots.length > 0 ? (
                          availableTimeSlots.map((timeSlot) => (
                            <SelectItem key={timeSlot} value={timeSlot}>
                              {timeSlot}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-slots" disabled>
                            Nenhum horário disponível
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre o serviço..."
                      className="resize-none"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Salvando..."
                  : appointmentInEdit
                  ? "Atualizar Agendamento"
                  : "Criar Agendamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
