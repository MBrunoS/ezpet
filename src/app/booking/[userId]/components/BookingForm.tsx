"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  PawPrint,
  DollarSign,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Client, Pet, Service, Appointment } from "@/types";
import {
  useAddPetPublic,
  usePetsByClientPublic,
  useServicesPublic,
  useAddAppointmentPublic,
} from "@/hooks/queries";
import { useAvailableTimeSlotsPublic } from "@/hooks/useAvailableTimeSlotsPublic";
import { toast } from "sonner";

const petSchema = z.object({
  name: z.string().min(1, "Nome do pet é obrigatório"),
  species: z.string().min(1, "Espécie é obrigatória"),
  breed: z.string().min(1, "Raça é obrigatória"),
  age: z.number().min(0, "Idade deve ser maior ou igual a 0"),
  weight: z.number().min(0.1, "Peso deve ser maior que 0"),
  observations: z.string().optional(),
});

const bookingSchema = z.object({
  petId: z.string().min(1, "Selecione um pet"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  date: z.date().refine((date) => date > new Date(), {
    message: "A data deve ser futura",
  }),
  time: z.string().min(1, "Selecione um horário"),
  observations: z.string().optional(),
});

type PetFormData = z.infer<typeof petSchema>;
type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  userId: string;
  clientData: Client;
  onBack: () => void;
  onBookingComplete: () => void;
}

export function BookingForm({
  userId,
  clientData,
  onBack,
  onBookingComplete,
}: BookingFormProps) {
  const [step, setStep] = useState<"pet" | "booking">("pet");
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const addPetMutation = useAddPetPublic(userId);
  const addAppointmentMutation = useAddAppointmentPublic(userId);
  const { data: pets = [] } = usePetsByClientPublic(userId, clientData.id);
  const { data: services = [] } = useServicesPublic(userId);

  const petForm = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      age: 0,
      weight: 0,
      observations: "",
    },
  });

  const bookingForm = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      petId: "",
      serviceId: "",
      date: new Date(),
      time: "",
      observations: "",
    },
  });

  // Observar a data e serviço selecionados para calcular horários disponíveis
  const selectedDate = bookingForm.watch("date");
  const selectedServiceId = bookingForm.watch("serviceId");

  // Usar useMemo para evitar recriações desnecessárias
  const currentSelectedService = useMemo(() => {
    return (
      selectedService ||
      services.find((s) => s.id === selectedServiceId) ||
      null
    );
  }, [selectedService, selectedServiceId, services]);

  // Função para formatar data para input (mesma do painel)
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

  const parsedSelectedDate = useMemo(() => {
    return selectedDate || new Date();
  }, [selectedDate]);

  // Usar o hook para calcular horários disponíveis
  const {
    availableTimeSlots,
    loading: loadingTimeSlots,
    formatTime,
    isWorkingDay,
  } = useAvailableTimeSlotsPublic({
    userId,
    selectedDate: parsedSelectedDate,
    selectedService: currentSelectedService,
  });

  const onPetSubmit = async (data: PetFormData) => {
    try {
      const result = await addPetMutation.mutateAsync({
        ...data,
        clientId: clientData.id,
      });

      const newPet: Pet = {
        id: result.id,
        ...data,
        userId: userId,
        clientId: clientData.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setSelectedPet(newPet);
      setStep("booking");
      bookingForm.setValue("petId", newPet.id);
      toast.success("Pet cadastrado com sucesso!");
    } catch (error) {
      // Erro já tratado pela mutation
    }
  };

  const onBookingSubmit = async (data: BookingFormData) => {
    if (!selectedService) {
      toast.error("Selecione um serviço");
      return;
    }

    try {
      // Combinar data e hora
      const appointmentDate = new Date(data.date);
      const [hour, minute] = data.time.split(":").map(Number);
      appointmentDate.setHours(hour, minute, 0, 0);

      const appointmentData: Omit<Appointment, "id" | "userId"> = {
        clientId: clientData.id,
        petId: data.petId,
        serviceId: data.serviceId,
        date: appointmentDate,
        price: selectedService.price,
        selectedExtras: [],
        observations: data.observations,
        status: "scheduled",
      };

      await addAppointmentMutation.mutateAsync(appointmentData);
      setBookingSuccess(true);
      onBookingComplete();
    } catch (error) {
      // Erro já tratado pela mutation
    }
  };

  const handlePetSelection = (pet: Pet) => {
    setSelectedPet(pet);
    bookingForm.setValue("petId", pet.id);
    setStep("booking");
  };

  const handleServiceSelection = (service: Service) => {
    setSelectedService(service);
    bookingForm.setValue("serviceId", service.id);
  };

  if (bookingSuccess) {
    return (
      <div className="space-y-6 text-center">
        <CheckCircle className="mx-auto w-16 h-16 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Agendamento Confirmado!
        </h2>
        <p className="text-gray-600">
          Seu agendamento foi realizado com sucesso. Você receberá uma
          confirmação por email.
        </p>
        <Button onClick={onBack} className="mt-4">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex gap-2 items-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Agendamento</h1>
      </div>

      {/* Informações do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <PawPrint className="w-5 h-5" />
            Cliente: {clientData.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <span className="font-medium">Telefone:</span> {clientData.phone}
            </div>
            <div>
              <span className="font-medium">Email:</span> {clientData.email}
            </div>
          </div>
        </CardContent>
      </Card>

      {step === "pet" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <PawPrint className="w-5 h-5" />
              Selecionar Pet
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pets.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Selecione um pet existente ou cadastre um novo:
                </p>

                {/* Pets existentes */}
                <div className="grid gap-3">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="p-4 rounded-lg border cursor-pointer hover:bg-gray-50"
                      onClick={() => handlePetSelection(pet)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{pet.name}</h4>
                          <p className="text-sm text-gray-600">
                            {pet.species} - {pet.breed}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Selecionar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <p className="mb-3 text-sm text-gray-600">
                    Ou cadastre um novo pet:
                  </p>
                </div>
              </div>
            ) : (
              <p className="mb-4 text-sm text-gray-600">
                Nenhum pet cadastrado. Cadastre um novo pet:
              </p>
            )}

            {/* Formulário para novo pet */}
            <Form {...petForm}>
              <form
                onSubmit={petForm.handleSubmit(onPetSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={petForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Pet</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do pet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={petForm.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Espécie</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a espécie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cachorro">Cachorro</SelectItem>
                            <SelectItem value="gato">Gato</SelectItem>
                            <SelectItem value="ave">Ave</SelectItem>
                            <SelectItem value="roedor">Roedor</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={petForm.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raça</FormLabel>
                        <FormControl>
                          <Input placeholder="Raça do pet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={petForm.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade (anos)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={petForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={petForm.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre o pet..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={addPetMutation.isPending}
                  className="w-full"
                >
                  {addPetMutation.isPending
                    ? "Cadastrando..."
                    : "Cadastrar Pet e Continuar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {step === "booking" && (
        <>
          {/* Seleção de Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <DollarSign className="w-5 h-5" />
                Selecionar Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedService?.id === service.id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleServiceSelection(service)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">
                          {service.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duração: {service.duration} min
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          R$ {service.price.toFixed(2)}
                        </p>
                        <Button variant="outline" size="sm">
                          Selecionar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informações do Serviço */}
              {selectedService && (
                <div className="p-4 mt-4 space-y-2 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium">
                    Informações do Serviço
                  </h4>
                  <p className="text-sm">
                    <span className="font-medium">Serviço:</span>{" "}
                    {selectedService.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Preço:</span> R${" "}
                    {selectedService.price.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Duração:</span>{" "}
                    {selectedService.duration} minutos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data e Horário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <Calendar className="w-5 h-5" />
                Data e Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...bookingForm}>
                <form
                  onSubmit={bookingForm.handleSubmit(onBookingSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={bookingForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              value={formatDateForInput(field.value)}
                              onChange={(e) => {
                                // Criar a data considerando o timezone local
                                const [year, month, day] = e.target.value
                                  .split("-")
                                  .map(Number);
                                const newDate = new Date(year, month - 1, day);

                                // Manter o horário atual se existir
                                const currentTime = field.value;
                                if (currentTime) {
                                  newDate.setHours(
                                    currentTime.getHours(),
                                    currentTime.getMinutes(),
                                    0,
                                    0
                                  );
                                }
                                field.onChange(newDate);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bookingForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={
                              !selectedDate ||
                              !selectedService ||
                              loadingTimeSlots ||
                              !isWorkingDay
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o horário" />
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
                              Selecione um serviço para ver os horários
                              disponíveis
                            </p>
                          )}
                          {isWorkingDay &&
                            selectedService &&
                            loadingTimeSlots && (
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
                  </div>

                  <FormField
                    control={bookingForm.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre o agendamento..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={
                      addAppointmentMutation.isPending || !selectedService
                    }
                    className="w-full"
                  >
                    {addAppointmentMutation.isPending
                      ? "Agendando..."
                      : "Confirmar Agendamento"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
