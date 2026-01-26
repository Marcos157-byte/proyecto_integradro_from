import client from "../api/client";
import type { SuccessResponse } from "../types/api.types";
import type { Proveedor, ProveedoresPaginadosResponse, ProveedorResponse } from "../types/proveedor.type";
;

const PATH = "/proveedores";

/**
 * Obtiene la lista de proveedores paginada desde Postgres
 * @param params Incluye page, limit, search, etc.
 */
export async function getProveedores(params: any): Promise<ProveedoresPaginadosResponse> {
  const { data } = await client.get<ProveedoresPaginadosResponse>(PATH, { params });
  return data;
}

/**
 * Obtiene un solo proveedor por su ID (UUID)
 * Incluye la relación con productos
 */
export async function getProveedorById(id: string): Promise<ProveedorResponse> {
  const { data } = await client.get<ProveedorResponse>(`${PATH}/${id}`);
  return data;
}

/**
 * Crea un nuevo proveedor en la base de datos Postgres
 */
export async function createProveedor(payload: Partial<Proveedor>): Promise<ProveedorResponse> {
  const { data } = await client.post<ProveedorResponse>(PATH, payload);
  return data;
}

/**
 * Actualiza los datos de un proveedor existente
 */
export async function updateProveedor(id: string, payload: Partial<Proveedor>): Promise<ProveedorResponse> {
  const { data } = await client.put<ProveedorResponse>(`${PATH}/${id}`, payload);
  return data;
}

/**
 * Elimina físicamente un proveedor de Postgres
 */
export async function deleteProveedor(id: string): Promise<SuccessResponse<null>> {
  const { data } = await client.delete<SuccessResponse<null>>(`${PATH}/${id}`);
  return data;
}