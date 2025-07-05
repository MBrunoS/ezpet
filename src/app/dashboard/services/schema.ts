import { z } from "zod";

export const serviceExtraSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome do extra é obrigatório"),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  description: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.number().min(0, "Preço deve ser maior ou igual a zero"),
  duration: z.number().min(15, "Duração mínima é 15 minutos").max(480, "Duração máxima é 8 horas"),
  extras: z.array(serviceExtraSchema),
  isActive: z.boolean(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
export type ServiceExtraFormData = z.infer<typeof serviceExtraSchema>; 