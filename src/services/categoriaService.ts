import client from "../api/client"; 
import type { SuccessResponse } from "../types/api.types";
import type { 
  Categoria, 
  CategoriaResponse, 
  CategoriasPaginadasResponse 
} from "../types/categoria.types";

const PATH = "/categorias";

/**
 * Obtiene la lista de categorías paginada desde MongoDB
 */
export async function getCategorias(page: number = 1, limit: number = 10, search?: string): Promise<CategoriasPaginadasResponse> {
  const { data } = await client.get<CategoriasPaginadasResponse>(PATH, {
    params: { 
      page, 
      limit, 
      search,
      searchField: 'nombre' // Buscamos por nombre como en el backend
    }
  });
  return data;
}

/**
 * Obtiene una sola categoría por su UUID (id_categoria)
 */
export async function getCategoriaById(id: string): Promise<CategoriaResponse> {
  const { data } = await client.get<CategoriaResponse>(`${PATH}/${id}`);
  return data;
}

/**
 * Registra una nueva categoría
 */
export async function createCategoria(payload: Partial<Categoria>): Promise<CategoriaResponse> {
  const { data } = await client.post<CategoriaResponse>(PATH, payload);
  return data;
}

/**
 * Actualiza una categoría existente usando id_categoria
 */
export async function updateCategoria(id: string, payload: Partial<Categoria>): Promise<CategoriaResponse> {
  const { data } = await client.put<CategoriaResponse>(`${PATH}/${id}`, payload);
  return data;
}

/**
 * Elimina una categoría usando id_categoria
 */
export async function deleteCategoria(id: string): Promise<SuccessResponse<null>> {
  const { data } = await client.delete<SuccessResponse<null>>(`${PATH}/${id}`);
  return data;
}