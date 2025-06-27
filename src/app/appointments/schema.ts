import { z } from "zod";

export const appointmentSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório"),
  petId: z.string().min(1, "Pet é obrigatório"),
  serviceId: z.string().min(1, "Serviço é obrigatório"),
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

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const serviceTypes = [
  { value: "banho", label: "Banho" },
  { value: "tosa", label: "Tosa" },
  { value: "banho_tosa", label: "Banho + Tosa" },
  { value: "tosa_higienica", label: "Tosa Higiênica" },
  { value: "hidratacao", label: "Hidratação" },
  { value: "escovacao", label: "Escovação" },
] as const;

export const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
] as const; 