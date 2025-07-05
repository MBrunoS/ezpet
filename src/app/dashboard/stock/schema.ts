import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.number().min(0, "Preço deve ser maior que zero"),
  quantity: z.number().min(0, "Quantidade deve ser maior ou igual a zero"),
  category: z.string().min(1, "Categoria é obrigatória"),
  minStock: z
    .number()
    .min(0, "Estoque mínimo deve ser maior ou igual a zero"),
});

export const stockMovementSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  type: z.enum(["entrada", "saida"], {
    required_error: "Tipo de movimentação é obrigatório",
  }),
  quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
  reason: z.string().min(1, "Motivo é obrigatório"),
  observation: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type StockMovementFormData = z.infer<typeof stockMovementSchema>;