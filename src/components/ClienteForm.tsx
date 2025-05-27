import React, { useState, ChangeEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Cliente, Pet } from "../types";

interface ClienteFormData {
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
}

interface NovoPet {
  nome: string;
  especie: string;
  raca: string;
  idade: string;
}

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: Cliente) => Promise<void>;
  onCancel?: () => void;
}

export default function ClienteForm({
  cliente,
  onSubmit,
  onCancel,
}: ClienteFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormData>({
    defaultValues: cliente || {
      nome: "",
      email: "",
      telefone: "",
      endereco: "",
    },
  });

  const [pets, setPets] = useState<Pet[]>(cliente?.pets || []);
  const [novoPet, setNovoPet] = useState<NovoPet>({
    nome: "",
    especie: "",
    raca: "",
    idade: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const adicionarPet = (): void => {
    if (novoPet.nome && novoPet.especie) {
      setPets([
        ...pets,
        {
          ...novoPet,
          id: Date.now().toString(),
          idade: parseInt(novoPet.idade) || 0,
          peso: 0,
          observacoes: "",
        },
      ]);
      setNovoPet({ nome: "", especie: "", raca: "", idade: "" });
    }
  };

  const removerPet = (id: string): void => {
    setPets(pets.filter((pet) => pet.id !== id));
  };

  const handleFormSubmit: SubmitHandler<ClienteFormData> = async (data) => {
    setLoading(true);
    try {
      await onSubmit({ ...data, id: cliente?.id || "", pets });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações do Cliente</h3>

        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome Completo
          </label>
          <input
            id="nome"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("nome", { required: "Nome é obrigatório" })}
          />
          {errors.nome && (
            <p className="text-error text-sm mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              id="telefone"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              {...register("telefone", { required: "Telefone é obrigatório" })}
            />
            {errors.telefone && (
              <p className="text-error text-sm mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="endereco"
            className="block text-sm font-medium text-gray-700"
          >
            Endereço
          </label>
          <input
            id="endereco"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("endereco")}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pets</h3>

        {pets.length > 0 ? (
          <div className="space-y-2">
            {pets.map((pet, index) => (
              <div
                key={pet.id || index}
                className="p-3 border rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{pet.nome}</p>
                  <p className="text-sm text-gray-600">
                    {pet.especie} - {pet.raca}{" "}
                    {pet.idade ? `- ${pet.idade} ano(s)` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removerPet(pet.id)}
                  className="text-error hover:text-error-dark"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Nenhum pet cadastrado</p>
        )}

        <div className="border p-4 rounded-md">
          <h4 className="text-sm font-medium mb-3">Adicionar Pet</h4>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label
                htmlFor="petNome"
                className="block text-xs font-medium text-gray-700"
              >
                Nome do Pet
              </label>
              <input
                id="petNome"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                value={novoPet.nome}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNovoPet({ ...novoPet, nome: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="petEspecie"
                className="block text-xs font-medium text-gray-700"
              >
                Espécie
              </label>
              <select
                id="petEspecie"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                value={novoPet.especie}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setNovoPet({ ...novoPet, especie: e.target.value })
                }
              >
                <option value="">Selecione</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Roedor">Roedor</option>
                <option value="Réptil">Réptil</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label
                htmlFor="petRaca"
                className="block text-xs font-medium text-gray-700"
              >
                Raça
              </label>
              <input
                id="petRaca"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                value={novoPet.raca}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNovoPet({ ...novoPet, raca: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="petIdade"
                className="block text-xs font-medium text-gray-700"
              >
                Idade (anos)
              </label>
              <input
                id="petIdade"
                type="number"
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                value={novoPet.idade}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNovoPet({ ...novoPet, idade: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="button"
            onClick={adicionarPet}
            className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark"
          >
            Adicionar Pet
          </button>
        </div>
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
            : cliente
            ? "Atualizar Cliente"
            : "Cadastrar Cliente"}
        </button>
      </div>
    </form>
  );
}
