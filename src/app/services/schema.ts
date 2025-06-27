import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  duration: z.number().min(15, "Duração mínima é 15 minutos").max(480, "Duração máxima é 8 horas"),
  isActive: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const serviceCategories = [
  "Banho e Tosa",
  "Tosa Higiênica", 
  "Hidratação",
  "Escovação",
  "Corte de Unhas",
  "Limpeza de Ouvidos",
  "Outros",
] as const; 