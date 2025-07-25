"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, PawPrint, DollarSign } from "lucide-react";
import { Appointment, Client, Pet } from "@/types";
import { appointmentSchema, AppointmentFormData } from "../schema";
import { useServices } from "@/hooks/queries/useServicesQuery";
import { useAvailableTimeSlots } from "@/hooks/useAvailableTimeSlots";
import { ServiceExtrasSelector } from "./ServiceExtrasSelector";
import { formatCurrency } from "@/lib/utils";

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  appointmentInEdit: Appointment | null;
  clients: Client[];
  pets: Pet[];
  loadingPets: boolean;
}

export function AppointmentForm({
  isOpen,
  onClose,
  onSubmit,
  appointmentInEdit,
  clients,
  pets,
  loadingPets,
}: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  const { data: services, isLoading: loadingServices } = useServices();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: "",
      petId: "",
      serviceId: "",
      date: new Date(),
      selectedExtras: [],
      observations: "",
    },
  });

  const selectedDate = form.watch("date");
  const selectedServiceId = form.watch("serviceId");
  const selectedService =
    services?.find((service) => service.id === selectedServiceId) || null;

  // Usar o hook para calcular horários disponíveis
  const {
    availableTimeSlots,
    loading: loadingTimeSlots,
    formatTime,
    isWorkingDay,
  } = useAvailableTimeSlots({
    selectedDate,
    selectedService,
    excludeId: appointmentInEdit?.id,
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (appointmentInEdit && isOpen) {
      form.reset({
        clientId: appointmentInEdit.clientId,
        petId: appointmentInEdit.petId,
        serviceId: appointmentInEdit.serviceId,
        date: appointmentInEdit.date,
        selectedExtras: appointmentInEdit.selectedExtras || [],
        observations: appointmentInEdit.observations || "",
      });
    } else if (!appointmentInEdit && isOpen) {
      form.reset({
        clientId: "",
        petId: "",
        serviceId: "",
        date: new Date(),
        selectedExtras: [],
        observations: "",
      });
    }
  }, [appointmentInEdit, isOpen, form]);

  const handleSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  const selectedClientId = form.watch("clientId");

  // Filtrar pets do cliente selecionado
  const clientPets = pets.filter((pet) => pet.clientId === selectedClientId);

  const formatDateForInput = (date: Date) => {
    // Ajustar para timezone local para evitar problemas de UTC
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {appointmentInEdit ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
          <DialogDescription>
            {appointmentInEdit
              ? "Atualize as informações do agendamento"
              : "Agende um novo serviço"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="overflow-y-auto flex-1 pr-2 space-y-6"
          >
            {/* Cliente */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 items-center">
                    <User className="w-4 h-4" />
                    Cliente
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.length === 0 ? (
                        <SelectItem value="no-clients" disabled>
                          Nenhum cliente cadastrado
                        </SelectItem>
                      ) : (
                        clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pet */}
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
                    disabled={loading || !selectedClientId || loadingPets}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um pet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!selectedClientId ? (
                        <SelectItem value="no-client" disabled>
                          Selecione um cliente primeiro
                        </SelectItem>
                      ) : clientPets.length === 0 ? (
                        <SelectItem value="no-pets" disabled>
                          Nenhum pet cadastrado para este cliente
                        </SelectItem>
                      ) : (
                        clientPets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Serviço */}
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 items-center">
                    <DollarSign className="w-4 h-4" />
                    Serviço
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading || loadingServices}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingServices ? (
                        <SelectItem value="loading" disabled>
                          Carregando serviços...
                        </SelectItem>
                      ) : services?.length === 0 ? (
                        <SelectItem value="no-services" disabled>
                          Nenhum serviço cadastrado
                        </SelectItem>
                      ) : (
                        services
                          ?.filter((service) => service.isActive)
                          .map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - R$ {service.price.toFixed(2)}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data */}
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
                      value={formatDateForInput(field.value)}
                      onChange={(e) => {
                        // Criar a data considerando o timezone local
                        const [year, month, day] = e.target.value
                          .split("-")
                          .map(Number);
                        const newDate = new Date(year, month - 1, day);

                        // Manter o horário atual
                        const currentTime = field.value;
                        newDate.setHours(
                          currentTime.getHours(),
                          currentTime.getMinutes(),
                          0,
                          0
                        );
                        field.onChange(newDate);
                      }}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Horário */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 items-center">
                    <Clock className="w-4 h-4" />
                    Horário
                  </FormLabel>
                  <Select
                    value={formatTime(field.value)}
                    onValueChange={(timeString) => {
                      const [hours, minutes] = timeString
                        .split(":")
                        .map(Number);
                      const newDate = new Date(field.value);
                      newDate.setHours(hours, minutes, 0, 0);
                      field.onChange(newDate);
                    }}
                    disabled={
                      loading ||
                      loadingTimeSlots ||
                      !selectedService ||
                      !isWorkingDay
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isWorkingDay ? (
                        <SelectItem value="closed" disabled>
                          Pet shop fechado neste dia
                        </SelectItem>
                      ) : !selectedService ? (
                        <SelectItem value="no-service" disabled>
                          Selecione um serviço primeiro
                        </SelectItem>
                      ) : loadingTimeSlots ? (
                        <SelectItem value="loading" disabled>
                          Carregando horários disponíveis...
                        </SelectItem>
                      ) : availableTimeSlots.length === 0 ? (
                        <SelectItem value="no-slots" disabled>
                          Nenhum horário disponível
                        </SelectItem>
                      ) : (
                        availableTimeSlots.map((slot) => (
                          <SelectItem
                            key={slot.time.getTime()}
                            value={formatTime(slot.time)}
                          >
                            {formatTime(slot.time)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {/* Mensagem informativa */}
                  {!isWorkingDay && (
                    <p className="text-sm text-orange-600">
                      Pet shop fechado neste dia
                    </p>
                  )}
                  {isWorkingDay && !selectedService && (
                    <p className="text-sm text-blue-600">
                      Selecione um serviço para ver os horários disponíveis
                    </p>
                  )}
                  {isWorkingDay && selectedService && loadingTimeSlots && (
                    <p className="text-sm text-gray-600">
                      Carregando horários disponíveis...
                    </p>
                  )}
                  {isWorkingDay &&
                    selectedService &&
                    !loadingTimeSlots &&
                    availableTimeSlots.length === 0 && (
                      <p className="text-sm text-red-600">
                        Nenhum horário disponível para este serviço
                      </p>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informações do Serviço */}
            {selectedService && (
              <div className="p-4 space-y-2 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium">Informações do Serviço</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Nome: {selectedService.name}</div>
                  <div>Preço: R$ {selectedService.price.toFixed(2)}</div>
                  <div>Duração: {selectedService.duration} minutos</div>
                  {selectedService.description && (
                    <div>Descrição: {selectedService.description}</div>
                  )}
                </div>
              </div>
            )}

            {/* Extras do Serviço */}
            {selectedService &&
              selectedService.extras &&
              selectedService.extras.length > 0 && (
                <FormField
                  control={form.control}
                  name="selectedExtras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extras Disponíveis</FormLabel>
                      <FormControl>
                        <ServiceExtrasSelector
                          extras={selectedService.extras}
                          selectedExtras={field.value}
                          onExtrasChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            {/* Observações */}
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais..."
                      className="resize-none"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-3 pt-3 mt-3 border-t sm:flex-col">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total do Agendamento:</span>
            <span className="text-sm font-medium text-green-600">
              {formatCurrency(
                form
                  .watch("selectedExtras")
                  .reduce((sum, extra) => sum + extra.price, 0) +
                  (selectedService?.price || 0)
              )}
            </span>
          </div>
          <div className="flex flex-col gap-2 justify-end mt-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              onClick={form.handleSubmit(handleSubmit)}
            >
              {loading
                ? "Salvando..."
                : appointmentInEdit
                ? "Atualizar Agendamento"
                : "Criar Agendamento"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
