import type { SuccessResponse, PaginatedResponse } from "./api.types";

/**
 * Interfaz que refleja la entidad Proveedor de Postgres/TypeORM
 */
export interface Proveedor {
  id_proveedor: string; // UUID generado por Postgres
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  // La relación de productos es opcional al listar proveedores
  productos?: any[]; 
}

/**
 * Respuesta para un solo proveedor
 * NestJS devuelve: { success: true, message: "...", data: { Proveedor } }
 */
export type ProveedorResponse = SuccessResponse<Proveedor>;

/**
 * Respuesta para el listado de proveedores (Paginación estándar de TypeORM)
 * NestJS devuelve: { success: true, message: "...", data: { data: [], total, page, limit } }
 */
export type ProveedoresPaginadosResponse = SuccessResponse<PaginatedResponse<Proveedor>>;