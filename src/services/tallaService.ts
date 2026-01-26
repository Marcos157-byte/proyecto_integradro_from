import client from "../api/client";
import type { SuccessResponse } from "../types/api.types";
import type { 
  Talla, 
  TallaResponse, 
  TallasPaginadasResponse 
} from "../types/talla.types";

const PATH = "/tallas";

/**
 * Obtiene la lista de tallas paginada desde MongoDB
 * Usa PaginatedResponseMongo para manejar docs, totalDocs, etc.
 */
export async function getTallas(page: number = 1, limit: number = 10, search?: string): Promise<TallasPaginadasResponse> {
  const { data } = await client.get<TallasPaginadasResponse>(PATH, {
    params: { 
      page, 
      limit, 
      search,
      searchField: 'nombre' // Según la validación de tu Schema (solo letras)
    }
  });
  return data;
}

/**
 * Obtiene una sola talla por su ID único (UUID)
 */
export async function getTallaById(id: string): Promise<TallaResponse> {
  const { data } = await client.get<TallaResponse>(`${PATH}/${id}`);
  return data;
}

/**
 * Registra una nueva talla en MongoDB
 * @param payload Objeto con el nombre de la talla (ej: { nombre: "XL" })
 */
export async function createTalla(payload: Partial<Talla>): Promise<TallaResponse> {
  const { data } = await client.post<TallaResponse>(PATH, payload);
  return data;
}

/**
 * Actualiza el nombre de una talla existente
 */
export async function updateTalla(id: string, payload: Partial<Talla>): Promise<TallaResponse> {
  const { data } = await client.put<TallaResponse>(`${PATH}/${id}`, payload);
  return data;
}

/**
 * Elimina una talla de la base de datos
 */
export async function deleteTalla(id: string): Promise<SuccessResponse<null>> {
  const { data } = await client.delete<SuccessResponse<null>>(`${PATH}/${id}`);
  return data;
}