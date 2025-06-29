"use client";

import { AlertTriangle } from "lucide-react";

export default function BookingPage() {
  return (
    <div className="flex justify-center items-center py-8 min-h-screen bg-gradient-to-br bg-stone-50">
      <div className="container px-4 mx-auto max-w-4xl text-center">
        <AlertTriangle className="mx-auto mb-4 w-16 h-16 text-yellow-600" />
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Link de Agendamento Inválido
        </h1>
        <p className="mb-4 text-gray-600">
          Entre em contato com o pet shop para obter o link correto de
          agendamento.
        </p>
      </div>
    </div>
  );
}
