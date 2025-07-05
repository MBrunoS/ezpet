"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormMask } from "use-mask-input";
import { profileFormSchema, ProfileFormData } from "../schema";
import { PetShopProfile, WorkingHours } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Phone, Building2, Users, Coffee } from "lucide-react";

interface ProfileFormProps {
  profile: PetShopProfile | null;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  loading?: boolean;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
] as const;

const DEFAULT_WORKING_HOURS: WorkingHours[] = DAYS_OF_WEEK.map((day) => ({
  day: day.value,
  isOpen: day.value !== "sunday",
  openTime: "08:00",
  closeTime: "18:00",
}));

export function ProfileForm({
  profile,
  onSubmit,
  loading = false,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: {
        street: profile?.address.street || "",
        number: profile?.address.number || "",
        complement: profile?.address.complement || "",
        neighborhood: profile?.address.neighborhood || "",
        city: profile?.address.city || "",
        state: profile?.address.state || "",
        zipCode: profile?.address.zipCode || "",
      },
      workingHours: profile?.workingHours || DEFAULT_WORKING_HOURS,
      lunchStart: profile?.lunchStart || "",
      lunchEnd: profile?.lunchEnd || "",
      appointmentCapacity: profile?.appointmentCapacity || 2,
    },
  });

  const registerWithMask = useHookFormMask(register);

  const { fields } = useFieldArray({
    control,
    name: "workingHours",
  });

  const watchedWorkingHours = watch("workingHours");

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name);
      setValue("phone", profile.phone);
      setValue("address", profile.address);
      setValue("workingHours", profile.workingHours);
      setValue("lunchStart", profile.lunchStart || "");
      setValue("lunchEnd", profile.lunchEnd || "");
      setValue("appointmentCapacity", profile.appointmentCapacity);
    }
  }, [profile, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Building2 className="w-5 h-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Pet Shop</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nome do seu pet shop"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...registerWithMask("phone", ["(99) 99999-9999"])}
                placeholder="(99) 99999-9999"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <MapPin className="w-5 h-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                {...register("address.street")}
                placeholder="Nome da rua"
              />
              {errors.address?.street && (
                <p className="text-sm text-red-600">
                  {errors.address.street.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                {...register("address.number")}
                placeholder="Número"
              />
              {errors.address?.number && (
                <p className="text-sm text-red-600">
                  {errors.address.number.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              {...register("address.complement")}
              placeholder="Apartamento, sala, etc. (opcional)"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                {...register("address.neighborhood")}
                placeholder="Nome do bairro"
              />
              {errors.address?.neighborhood && (
                <p className="text-sm text-red-600">
                  {errors.address.neighborhood.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                {...register("address.city")}
                placeholder="Nome da cidade"
              />
              {errors.address?.city && (
                <p className="text-sm text-red-600">
                  {errors.address.city.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                {...register("address.state")}
                placeholder="SP"
                maxLength={2}
              />
              {errors.address?.state && (
                <p className="text-sm text-red-600">
                  {errors.address.state.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                {...registerWithMask("address.zipCode", ["99999-999"])}
                placeholder="99999-999"
              />
              {errors.address?.zipCode && (
                <p className="text-sm text-red-600">
                  {errors.address.zipCode.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horários de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Clock className="w-5 h-5" />
            Horários de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => {
            const day = DAYS_OF_WEEK.find((d) => d.value === field.day);
            const isOpen = watchedWorkingHours[index]?.isOpen;

            return (
              <div key={field.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{day?.label}</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isOpen}
                      onCheckedChange={(checked) => {
                        setValue(`workingHours.${index}.isOpen`, checked);
                      }}
                    />
                    <span className="text-sm">
                      {isOpen ? "Aberto" : "Fechado"}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="grid grid-cols-1 gap-4 pl-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`openTime-${index}`}>Abertura</Label>
                      <Input
                        id={`openTime-${index}`}
                        type="time"
                        {...register(`workingHours.${index}.openTime`)}
                      />
                      {errors.workingHours?.[index]?.openTime && (
                        <p className="text-sm text-red-600">
                          {errors.workingHours[index]?.openTime?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`closeTime-${index}`}>Fechamento</Label>
                      <Input
                        id={`closeTime-${index}`}
                        type="time"
                        {...register(`workingHours.${index}.closeTime`)}
                      />
                      {errors.workingHours?.[index]?.closeTime && (
                        <p className="text-sm text-red-600">
                          {errors.workingHours[index]?.closeTime?.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {index < fields.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Horário de Almoço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Coffee className="w-5 h-5" />
            Horário de Almoço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configure o horário de almoço que será aplicado a todos os dias de
              funcionamento (opcional)
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lunchStart">Início do Almoço</Label>
                <Input
                  id="lunchStart"
                  type="time"
                  {...register("lunchStart")}
                  placeholder="12:00"
                />
                {errors.lunchStart && (
                  <p className="text-sm text-red-600">
                    {errors.lunchStart.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lunchEnd">Fim do Almoço</Label>
                <Input
                  id="lunchEnd"
                  type="time"
                  {...register("lunchEnd")}
                  placeholder="13:00"
                />
                {errors.lunchEnd && (
                  <p className="text-sm text-red-600">
                    {errors.lunchEnd.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Deixe em branco se não houver horário de almoço
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Capacidade de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Users className="w-5 h-5" />
            Capacidade de Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="appointmentCapacity">Pets por horário</Label>
            <Input
              id="appointmentCapacity"
              type="number"
              min="1"
              max="10"
              {...register("appointmentCapacity", { valueAsNumber: true })}
              placeholder="2"
            />
            <p className="text-sm text-gray-600">
              Número máximo de pets que podem ser atendidos no mesmo horário
            </p>
            {errors.appointmentCapacity && (
              <p className="text-sm text-red-600">
                {errors.appointmentCapacity.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </form>
  );
}
