import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Produto } from "../types";

interface ProdutoFormData {
  nome: string;
  preco: string;
  quantidade: string;
  estoqueMinimo: string;
  descricao?: string;
  categoria: string;
}

interface ProdutoFormProps {
  produto?: Produto;
  onSubmit: (data: Produto) => Promise<void>;
  onCancel?: () => void;
}

export default function ProdutoForm({
  produto,
  onSubmit,
  onCancel,
}: ProdutoFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProdutoFormData>({
    defaultValues: produto || {
      nome: "",
      preco: "",
      quantidade: "",
      estoqueMinimo: "",
      descricao: "",
      categoria: "",
    },
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleFormSubmit: SubmitHandler<ProdutoFormData> = async (data) => {
    setLoading(true);
    try {
      // Convertendo valores para número
      const produtoData: Produto = {
        ...data,
        id: produto?.id || "",
        preco: parseFloat(data.preco),
        quantidade: parseInt(data.quantidade),
        estoqueMinimo: parseInt(data.estoqueMinimo),
        dataCadastro: produto?.dataCadastro,
        dataAtualizacao: new Date(),
      };

      await onSubmit(produtoData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="nome"
          className="block text-sm font-medium text-gray-700"
        >
          Nome do Produto
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
            htmlFor="preco"
            className="block text-sm font-medium text-gray-700"
          >
            Preço (R$)
          </label>
          <input
            id="preco"
            type="number"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("preco", {
              required: "Preço é obrigatório",
              min: { value: 0, message: "Preço deve ser maior que zero" },
            })}
          />
          {errors.preco && (
            <p className="text-error text-sm mt-1">{errors.preco.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-gray-700"
          >
            Categoria
          </label>
          <select
            id="categoria"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("categoria", { required: "Categoria é obrigatória" })}
          >
            <option value="">Selecione uma categoria</option>
            <option value="racao">Ração</option>
            <option value="acessorio">Acessório</option>
            <option value="remedio">Remédio</option>
            <option value="higiene">Higiene</option>
            <option value="brinquedo">Brinquedo</option>
            <option value="outro">Outro</option>
          </select>
          {errors.categoria && (
            <p className="text-error text-sm mt-1">
              {errors.categoria.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="quantidade"
            className="block text-sm font-medium text-gray-700"
          >
            Quantidade
          </label>
          <input
            id="quantidade"
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("quantidade", {
              required: "Quantidade é obrigatória",
              min: {
                value: 0,
                message: "Quantidade deve ser maior ou igual a zero",
              },
            })}
          />
          {errors.quantidade && (
            <p className="text-error text-sm mt-1">
              {errors.quantidade.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="estoqueMinimo"
            className="block text-sm font-medium text-gray-700"
          >
            Estoque Mínimo
          </label>
          <input
            id="estoqueMinimo"
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            {...register("estoqueMinimo", {
              required: "Estoque mínimo é obrigatório",
              min: {
                value: 1,
                message: "Estoque mínimo deve ser pelo menos 1",
              },
            })}
          />
          {errors.estoqueMinimo && (
            <p className="text-error text-sm mt-1">
              {errors.estoqueMinimo.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="descricao"
          className="block text-sm font-medium text-gray-700"
        >
          Descrição
        </label>
        <textarea
          id="descricao"
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          {...register("descricao")}
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
            : produto
            ? "Atualizar Produto"
            : "Cadastrar Produto"}
        </button>
      </div>
    </form>
  );
}
