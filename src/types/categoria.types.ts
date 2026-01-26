import type { PaginatedResponseMongo, SuccessResponse } from "./api.types";

export interface Categoria {
  _id: string;
  id_categoria: string; // Tu UUID
  nombre: string;
  descripcion: string;
  __v?: number;
}

// 5. Tipos compuestos para tus servicios de Bodega
export type CategoriaResponse = SuccessResponse<Categoria>;
export type CategoriasPaginadasResponse = SuccessResponse<PaginatedResponseMongo<Categoria>>;