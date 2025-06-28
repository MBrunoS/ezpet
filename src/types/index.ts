export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  description?: string;
  minStock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceExtra {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Service {
  id: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // duração em minutos
  extras: ServiceExtra[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Appointment {
  id: string;
  userId: string;
  clientId: string;
  petId: string;
  serviceId: string; // Referência ao serviço
  date: Date;
  price: number;
  selectedExtras: ServiceExtra[]; // Extras selecionados
  observations?: string;
  status: 'scheduled' | 'completed' | 'canceled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  petsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Pet {
  id: string;
  userId: string;
  clientId: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  observations?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'user';
}

export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime: string; // formato HH:mm
  closeTime: string; // formato HH:mm
}

export interface PetShopProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: Address;
  workingHours: WorkingHours[];
  lunchStart?: string; // formato HH:mm (opcional)
  lunchEnd?: string; // formato HH:mm (opcional)
  appointmentCapacity: number; // número de pets por horário
  createdAt?: Date;
  updatedAt?: Date;
} 