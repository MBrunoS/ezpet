import React, { useState, useEffect, ChangeEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useClients } from "../hooks/useClients";
import { formatCurrency } from "../lib/utils";
import { Appointment, Client, Pet } from "../types";

interface Servico {
  id: string;
  nome: string;
  valorBase: number;
}

interface AgendamentoFormData {
  clienteId: string;
  petId: string;
  servico: string;
  data: Date;
  valor: string;
  observacoes: string;
}

interface AgendamentoFormProps {
  agendamento?: Appointment;
  onSubmit: (data: Appointment) => Promise<void>;
  onCancel?: () => void;
}

export default function AgendamentoForm({
  agendamento,
  onSubmit,
  onCancel,
}: AgendamentoFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgendamentoFormData>({
    defaultValues: agendamento
      ? {
          clienteId: agendamento.clientId || "",
          petId: agendamento.petId || "",
          servico: agendamento.service || "",
          data: agendamento.date || new Date(),
          valor: agendamento.price.toString(),
          observacoes: agendamento.observations || "",
        }
      : {
          clienteId: "",
          petId: "",
          servico: "",
          data: new Date(),
          valor: "",
          observacoes: "",
        },
  });

  const { clients: clientes } = useClients();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    agendamento?.date || new Date()
  );
  const [pets, setPets] = useState<Pet[]>([]);

  const selectedClienteId = watch("clienteId");

  useEffect(() => {
    if (selectedClienteId) {
      const clienteSelecionado = clientes.find(
        (c) => c.id === selectedClienteId
      );
      setPets(clienteSelecionado?.pets || []);
      setValue("petId", "");
    } else {
      setPets([]);
    }
  }, [selectedClienteId, clientes, setValue]);

  const handleDateChange = (date: Date | null): void => {
    if (date) {
      setSelectedDate(date);
      setValue("data", date);
    }
  };

  const servicos: Servico[] = [
    { id: "banho", nome: "Banho", valorBase: 40 },
    { id: "tosa", nome: "Tosa", valorBase: 50 },
    { id: "banhoTosa", nome: "Banho e Tosa", valorBase: 80 },
    { id: "consulta", nome: "Consulta Veterinária", valorBase: 100 },
    { id: "vacina", nome: "Vacinação", valorBase: 70 },
    { id: "outros", nome: "Outros Serviços", valorBase: 0 },
  ];

  const handleServicoChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const servicoId = e.target.value;
    const servico = servicos.find((s) => s.id === servicoId);
    if (servico) {
      setValue("valor", servico.valorBase.toString());
    }
  };

  const handleFormSubmit: SubmitHandler<AgendamentoFormData> = async (data) => {
    setLoading(true);
    try {
      const clienteSelecionado = clientes.find((c) => c.id === data.clienteId);
      const petSelecionado = clienteSelecionado?.pets.find(
        (p) => p.id === data.petId
      );
      const servicoSelecionado = servicos.find((s) => s.id === data.servico);

      const agendamentoCompleto: Appointment = {
        ...data,
        id: agendamento?.id || "",
        price: parseFloat(data.valor),
        clientName: clienteSelecionado?.name || "",
        petName: petSelecionado?.nome || "",
        serviceName: servicoSelecionado?.nome || "",
        status: agendamento?.status || "agendado",
      };

      await onSubmit(agendamentoCompleto);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="clienteId"
            className="block text-sm font-medium text-gray-700"
          >
            Cliente
          </label>
          <select
            id="clienteId"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("clienteId", { required: "Cliente é obrigatório" })}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.name}
              </option>
            ))}
          </select>
          {errors.clienteId && (
            <p className="text-error text-sm mt-1">
              {errors.clienteId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="petId"
            className="block text-sm font-medium text-gray-700"
          >
            Pet
          </label>
          <select
            id="petId"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={!selectedClienteId}
            {...register("petId", { required: "Pet é obrigatório" })}
          >
            <option value="">Selecione um pet</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} - {pet.species}
              </option>
            ))}
          </select>
          {errors.petId && (
            <p className="text-error text-sm mt-1">{errors.petId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="servico"
            className="block text-sm font-medium text-gray-700"
          >
            Serviço
          </label>
          <select
            id="servico"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("servico", { required: "Serviço é obrigatório" })}
            onChange={handleServicoChange}
          >
            <option value="">Selecione um serviço</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome} - {formatCurrency(servico.valorBase)}
              </option>
            ))}
          </select>
          {errors.servico && (
            <p className="text-error text-sm mt-1">{errors.servico.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="valor"
            className="block text-sm font-medium text-gray-700"
          >
            Valor (R$)
          </label>
          <input
            id="valor"
            type="number"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("valor", {
              required: "Valor é obrigatório",
              min: { value: 0, message: "Valor deve ser maior que zero" },
            })}
          />
          {errors.valor && (
            <p className="text-error text-sm mt-1">{errors.valor.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data e Hora
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="dd/MM/yyyy HH:mm"
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
            minDate={new Date()}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="observacoes"
          className="block text-sm font-medium text-gray-700"
        >
          Observações
        </label>
        <textarea
          id="observacoes"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          {...register("observacoes")}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:bg-gray-300"
        >
          {loading
            ? "Salvando..."
            : agendamento
            ? "Atualizar Agendamento"
            : "Criar Agendamento"}
        </button>
      </div>
    </form>
  );
}
