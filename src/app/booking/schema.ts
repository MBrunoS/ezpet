import { z } from "zod";

// Schema para registro do cliente
export const clientRegistrationSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(2, "Estado é obrigatório"),
    zipCode: z.string().min(8, "CEP deve ter pelo menos 8 dígitos"),
  }),
  pets: z.array(z.object({
    name: z.string().min(1, "Nome do pet é obrigatório"),
    species: z.string().min(1, "Espécie é obrigatória"),
    breed: z.string().min(1, "Raça é obrigatória"),
    age: z.number().min(0, "Idade deve ser maior ou igual a 0"),
    weight: z.number().min(0.1, "Peso deve ser maior que 0"),
    observations: z.string().optional(),
  })).min(1, "Pelo menos um pet é obrigatório"),
});

// Schema para agendamento
export const bookingSchema = z.object({
  petId: z.string().min(1, "Selecione um pet"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  date: z.date({
    required_error: "Data é obrigatória",
  }),
  selectedExtras: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    description: z.string().optional(),
  })),
  observations: z.string().optional(),
});

export type ClientRegistrationData = z.infer<typeof clientRegistrationSchema>;
export type BookingData = z.infer<typeof bookingSchema>; 