import client from "../api/client";
import type { SuccessResponse, PaginatedResponse } from "../types/api.types";
import type { Cliente } from "../types/cliente.dto";
 // El que definimos al inicio

const PATH = "/clientes";

/**
 * Obtener lista de clientes con paginación y búsqueda (por nombre o cédula)
 */
export async function listClientes(page: number = 1, limit: number = 10, search?: string) {
  const { data } = await client.get<SuccessResponse<PaginatedResponse<Cliente>>>(PATH, {
    params: { page, limit, search }
  });

  const res = data.data;

  return {
    docs: res.data,
    totalDocs: res.total,
    totalPages: Math.ceil(res.total / res.limit),
    page: res.page,
    limit: res.limit,
  };
}

/**
 * Crear un nuevo cliente (para el registro en la venta)
 */
export async function createCliente(clienteData: Partial<Cliente>): Promise<Cliente> {
  const { data } = await client.post<SuccessResponse<Cliente>>(PATH, clienteData);
  return data.data;
}

/**
 * Buscar un cliente específico por su ID
 */
export async function getClienteById(id: string): Promise<Cliente> {
  const { data } = await client.get<SuccessResponse<Cliente>>(`${PATH}/${id}`);
  return data.data;
}

/**
 * Actualizar datos del cliente (dirección, teléfono, etc.)
 */
export async function updateCliente(id: string, clienteData: Partial<Cliente>): Promise<Cliente> {
  const { data } = await client.put<SuccessResponse<Cliente>>(`${PATH}/${id}`, clienteData);
  return data.data;
}

/**
 * Eliminar (o desactivar) un cliente
 */
export async function deleteCliente(id: string): Promise<void> {
  await client.delete(`${PATH}/${id}`);
}