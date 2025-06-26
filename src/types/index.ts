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

export interface Agendamento {
  id: string;
  clienteId: string;
  petId: string;
  servicoNome: string;
  servico: string;
  clienteNome: string;
  petNome: string;
  data: Date;
  valor: number;
  observacoes?: string;
  status: 'agendado' | 'concluido' | 'cancelado';
  dataCadastro?: Date;
  dataAtualizacao?: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
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