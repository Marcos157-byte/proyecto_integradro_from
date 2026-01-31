import client from "../api/client";
import type { SuccessResponse, PaginatedResponse } from "../types/api.types";
import type { Cliente } from "../types/cliente.type";


const PATH = "/clientes";

export async function listClientes(page: number = 1, limit: number = 10, search?: string) {
  const { data } = await client.get<SuccessResponse<PaginatedResponse<Cliente>>>(PATH, {
    params: { 
      page, 
      limit, 
      search: search || undefined,
      // IMPORTANTE: Tu backend recibe 'searchField' en el QueryDto
      searchField: search ? 'nombre' : undefined 
    }
  });

  const res = data.data; // Entramos al SuccessResponseDto.data

  return {
    docs: res.data,
    totalDocs: res.total,
    totalPages: Math.ceil(res.total / res.limit),
    page: res.page,
    limit: res.limit,
  };
}

export async function createCliente(clienteData: Partial<Cliente>): Promise<Cliente> {
  const { data } = await client.post<SuccessResponse<Cliente>>(PATH, clienteData);
  return data.data; // Retorna el objeto Cliente creado
}

export async function updateCliente(id: string, clienteData: Partial<Cliente>): Promise<Cliente> {
  const { data } = await client.put<SuccessResponse<Cliente>>(`${PATH}/${id}`, clienteData);
  return data.data; // Retorna el Cliente actualizado
}

export async function deleteCliente(id: string): Promise<void> {
  await client.delete(`${PATH}/${id}`);
}