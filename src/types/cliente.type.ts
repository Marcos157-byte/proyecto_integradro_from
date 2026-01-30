import type { PaginatedResponse, SuccessResponse } from "./api.types";

export type Cliente = {
  id_cliente: string;
  nombre: string;
  cedula: string;
  telefono: string; 
  email: string;
  direccion: string;
  isActive: boolean;
  createdAt?: string; 
};

// Estos están perfectos para documentar o usar en otros componentes
export type ClienteResponse = SuccessResponse<Cliente>;
export type ClientesPaginadosResponse = SuccessResponse<PaginatedResponse<Cliente>>;