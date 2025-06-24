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

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  pets: Pet[];
}

export interface Pet {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  peso: number;
  observacoes?: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'user';
} 