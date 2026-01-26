import type { PaginatedResponseMongo, SuccessResponse } from "./api.types";

export interface Categoria {
  _id: string;          // ID generado por MongoDB
  id_categoria: string; // Tu UUID generado por el Schema
  nombre: string;
  descripcion: string;
  __v?: number;         // Versión interna de Mongoose
}

/**
 * Representa la respuesta de una sola categoría 
 * (Estructura: { success: boolean, message: string, data: Categoria })
 */
export type CategoriaResponse = SuccessResponse<Categoria>;

/**
 * Representa la respuesta paginada de MongoDB
 * (Estructura: { success: boolean, message: string, data: PaginatedResponseMongo<Categoria> })
 */
export type CategoriasPaginadasResponse = SuccessResponse<PaginatedResponseMongo<Categoria>>;