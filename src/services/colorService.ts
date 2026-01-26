import client from "../api/client";
import type { SuccessResponse } from "../types/api.types";
import type { 
  Color, 
  ColorResponse, 
  ColoresPaginadosResponse 
} from "../types/color.types";

const PATH = "/colores";

/**
 * Obtiene la lista de colores (Paginada desde Postgres)
 * Útil para la tabla de gestión de colores
 */
export async function getColores(params: any): Promise<ColoresPaginadosResponse> {
  const { data } = await client.get<ColoresPaginadosResponse>(PATH, { params });
  return data;
}

/**
 * Versión simplificada para llenar Selects en los Modales de Producto
 * Retorna directamente el array de colores
 */
export async function listColores(): Promise<Color[]> {
  const { data } = await client.get<ColoresPaginadosResponse>(PATH);
  // Accedemos a data (SuccessResponseDto) -> data (PaginatedResponse) -> data (Array de Colores)
  return data.data?.data || [];
}

/**
 * Obtiene un color específico por su UUID
 */
export async function getColorById(id: string): Promise<ColorResponse> {
  const { data } = await client.get<ColorResponse>(`${PATH}/${id}`);
  return data;
}

/**
 * Registra un nuevo color en PostgreSQL
 */
export async function createColor(payload: Partial<Color>): Promise<ColorResponse> {
  const { data } = await client.post<ColorResponse>(PATH, payload);
  return data;
}

/**
 * Actualiza el nombre de un color existente
 */
export async function updateColor(id: string, payload: Partial<Color>): Promise<ColorResponse> {
  const { data } = await client.put<ColorResponse>(`${PATH}/${id}`, payload);
  return data;
}

/**
 * Elimina un color de la base de datos
 */
export async function deleteColor(id: string): Promise<SuccessResponse<null>> {
  const { data } = await client.delete<SuccessResponse<null>>(`${PATH}/${id}`);
  return data;
}