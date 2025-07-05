"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User, PawPrint, Phone, Mail } from "lucide-react";
import { BookingForm } from "./components/BookingForm";
import { ClientRegistrationForm } from "./components/ClientRegistrationForm";
import { Client } from "@/types";
import { usePetShopProfileByUserId } from "@/hooks/queries";

type Step = "welcome" | "client" | "booking";

interface BookingPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [clientData, setClientData] = useState<Client | null>(null);

  // Usar React.use() para desempacotar os parâmetros
  const { userId } = React.use(params);

  // Buscar dados do pet shop
  const { data: petShopProfile, isLoading: loadingProfile } =
    usePetShopProfileByUserId(userId);

  // Se o perfil do pet shop não existe, mostrar erro
  if (!loadingProfile && !petShopProfile) {
    return (
      <div className="py-8 min-h-screen bg-gradient-to-br bg-stone-50">
        <div className="container px-4 mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-600">
                Pet Shop não encontrado
              </CardTitle>
              <CardDescription>
                O link de agendamento não é válido ou o pet shop não existe.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const handleClientRegistered = (client: Client) => {
    setClientData(client);
    setCurrentStep("booking");
  };

  const handleBack = () => {
    if (currentStep === "booking") {
      setCurrentStep("client");
      setClientData(null);
    } else if (currentStep === "client") {
      setCurrentStep("welcome");
    }
  };

  const handleBookingComplete = () => {
    // Reset para permitir novo agendamento
    setCurrentStep("welcome");
    setClientData(null);
  };

  if (loadingProfile) {
    return (
      <div className="py-8 min-h-screen bg-gradient-to-br bg-stone-50">
        <div className="container px-4 mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Carregando...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br bg-stone-50">
      <div className="container px-4 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            {petShopProfile?.name || "EzPet"}
          </h1>
          <p className="text-xl text-gray-600">Agendamento Online</p>
          {petShopProfile?.phone && (
            <p className="mt-2 text-sm text-gray-500">
              Telefone: {petShopProfile.phone}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${
                currentStep !== "welcome" ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep !== "welcome"
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300"
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium">Identificação</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center ${
                currentStep === "booking" ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep === "booking"
                    ? "bg-green-600 border-green-600 text-white"
                    : "border-gray-300"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">Agendamento</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {currentStep === "welcome" &&
                `Bem-vindo ao ${petShopProfile?.name || "EzPet"}`}
              {currentStep === "client" && "Identificação do Cliente"}
              {currentStep === "booking" && "Agendar Serviço"}
            </CardTitle>
            <CardDescription>
              {currentStep === "welcome" &&
                "Faça seu agendamento de forma rápida e fácil"}
              {currentStep === "client" && "Informe seus dados para continuar"}
              {currentStep === "booking" &&
                "Escolha o serviço e horário desejado"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === "welcome" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="p-4 text-center">
                    <User className="mx-auto mb-3 w-12 h-12 text-blue-600" />
                    <h3 className="mb-2 font-semibold">Identificação</h3>
                    <p className="text-sm text-gray-600">
                      Informe seus dados pessoais
                    </p>
                  </div>
                  <div className="p-4 text-center">
                    <PawPrint className="mx-auto mb-3 w-12 h-12 text-green-600" />
                    <h3 className="mb-2 font-semibold">Pet</h3>
                    <p className="text-sm text-gray-600">Cadastre seu pet</p>
                  </div>
                  <div className="p-4 text-center">
                    <Calendar className="mx-auto mb-3 w-12 h-12 text-purple-600" />
                    <h3 className="mb-2 font-semibold">Agendamento</h3>
                    <p className="text-sm text-gray-600">
                      Escolha data e horário
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setCurrentStep("client")}
                    size="lg"
                    className="px-8"
                  >
                    Começar Agendamento
                  </Button>
                </div>

                <div className="text-sm text-center text-gray-500">
                  <p>Já é cliente? Entre em contato conosco</p>
                  <div className="flex justify-center items-center mt-2 space-x-4">
                    {petShopProfile?.phone && (
                      <div className="flex items-center">
                        <Phone className="mr-1 w-4 h-4" />
                        <span>{petShopProfile.phone}</span>
                      </div>
                    )}
                    {petShopProfile?.address && (
                      <div className="flex items-center">
                        <span>
                          {petShopProfile.address.city} -{" "}
                          {petShopProfile.address.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === "client" && (
              <ClientRegistrationForm
                userId={userId}
                onClientRegistered={handleClientRegistered}
                onBack={handleBack}
              />
            )}

            {currentStep === "booking" && clientData && (
              <BookingForm
                userId={userId}
                clientData={clientData}
                onBack={handleBack}
                onBookingComplete={handleBookingComplete}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
