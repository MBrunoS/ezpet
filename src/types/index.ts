export interface Product {
  id: string;
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
  clientId: string;
  petId: string;
  serviceId: string; // Referência ao serviço
  serviceName: string;
  service: string;
  clientName: string;
  petName: string;
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
  name: string;
  email: string;
  phone: string;
  address?: string;
  petsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Pet {
  id: string;
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

export interface ClientWithPets extends Client {
  pets: Pet[];
} 

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'user';
} 