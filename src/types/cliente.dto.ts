import type { SuccessResponse, PaginatedResponse } from './api.types';

export type Cliente = {
  id_cliente: string;
  nombre: string;
  cedula: string;
  email: string;
  // ... resto de campos
};

// Tipos compuestos para tus peticiones de Clientes
export type ClienteResponse = SuccessResponse<Cliente>;
export type ClientesPaginadosResponse = SuccessResponse<PaginatedResponse<Cliente>>;