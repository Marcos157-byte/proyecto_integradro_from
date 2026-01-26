import type { Categoria, CategoriaResponse, CategoriasPaginadasResponse } from "../types/categoria.types";
import client from "../api/client"; 
import type { SuccessResponse } from "../types/api.types";

const PATH = "/categorias";

/**
 * Trae la lista de categorías (Paginación de MongoDB)
 */
export async function listCategorias(params: any): Promise<CategoriasPaginadasResponse> {
  const { data } = await client.get<CategoriasPaginadasResponse>(PATH, { params });
  return data;
}

/**
 * Trae una categoría específica por su ID
 */
export async function getCategoriaById(id: string): Promise<CategoriaResponse> {
  const { data } = await client.get<CategoriaResponse>(`${PATH}/${id}`);
  return data;
}

/**
 * Crea una categoría en MongoDB
 */
export async function createCategoria(payload: Partial<Categoria>): Promise<CategoriaResponse> {
  const { data } = await client.post<CategoriaResponse>(PATH, payload);
  return data;
}

/**
 * Actualiza los datos de una categoría
 */
export async function updateCategoria(id: string, payload: Partial<Categoria>): Promise<CategoriaResponse> {
  const { data } = await client.put<CategoriaResponse>(`${PATH}/${id}`, payload);
  return data;
}

/**
 * Elimina la categoría de la base de datos
 */
export async function deleteCategoria(id: string): Promise<SuccessResponse<null>> {
  const { data } = await client.delete(`${PATH}/${id}`);
  return data;
}