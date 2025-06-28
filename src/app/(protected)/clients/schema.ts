import * as z from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  species: z.string().min(1, "Espécie é obrigatória"),
  breed: z.string().min(1, "Raça é obrigatória"),
  age: z.number().min(0, "Idade deve ser maior ou igual a zero"),
  weight: z.number().min(0, "Peso deve ser maior que zero"),
  observations: z.string().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: z.string().optional(),
});

export type PetFormData = z.infer<typeof petSchema>;
export type ClientFormData = z.infer<typeof clientSchema>; 