import type { SuccessResponse, PaginatedResponse } from "./api.types";

/**
 * Interfaz que refleja la entidad Color de Postgres/TypeORM
 */
export interface Color {
  id_color: string; // UUID de Postgres
  color: string;    // El nombre del color (ej: "Rojo", "Azul")
  productos?: any[]; // Relación opcional
}

/**
 * Respuesta para un solo color
 */
export type ColorResponse = SuccessResponse<Color>;

/**
 * Respuesta para el listado de colores paginados (Postgres)
 * NestJS devuelve: { success: true, data: { data: Color[], total, ... } }
 */
export type ColoresPaginadosResponse = SuccessResponse<PaginatedResponse<Color>>;