import { z } from "zod";

const workingHoursSchema = z.object({
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  isOpen: z.boolean(),
  openTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)"),
  closeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:mm)"),
}).refine((data) => {
  if (!data.isOpen) return true;
  
  const openTime = new Date(`2000-01-01T${data.openTime}:00`);
  const closeTime = new Date(`2000-01-01T${data.closeTime}:00`);
  
  return openTime < closeTime;
}, {
  message: "Horário de fechamento deve ser posterior ao horário de abertura",
  path: ["closeTime"]
});

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório").max(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),
});

export const profileFormSchema = z.object({
  name: z.string().min(1, "Nome do pet shop é obrigatório"),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone deve estar no formato (00) 00000-0000"),
  address: addressSchema,
  workingHours: z.array(workingHoursSchema).length(7, "Deve ter 7 dias da semana"),
  lunchStart: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
  }, "Formato de hora inválido (HH:mm)"),
  lunchEnd: z.string().optional().refine((val) => {
    if (!val || val === "") return true;
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
  }, "Formato de hora inválido (HH:mm)"),
  appointmentCapacity: z.number().min(1, "Capacidade deve ser pelo menos 1").max(10, "Capacidade máxima é 10"),
})
.refine((data) => {
  const hasLunchStart = data.lunchStart && data.lunchStart !== "";
  const hasLunchEnd = data.lunchEnd && data.lunchEnd !== "";
  
  return hasLunchStart === hasLunchEnd;
}, {
  message: "Ambos os horários de almoço devem estar preenchidos ou ambos vazios",
  path: ["lunchStart"]
})
.refine((data) => {
  const hasLunchStart = data.lunchStart && data.lunchStart !== "";
  const hasLunchEnd = data.lunchEnd && data.lunchEnd !== "";
  
  if (hasLunchStart && hasLunchEnd) {
    const lunchStart = new Date(`2000-01-01T${data.lunchStart}:00`);
    const lunchEnd = new Date(`2000-01-01T${data.lunchEnd}:00`);
    return lunchStart < lunchEnd;
  }
  
  return true;
}, {
  message: "Fim do almoço deve ser posterior ao início",
  path: ["lunchEnd"]
});

export type ProfileFormData = z.infer<typeof profileFormSchema>; 