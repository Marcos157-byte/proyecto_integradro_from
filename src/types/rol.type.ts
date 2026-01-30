import type { PaginatedResponse, SuccessResponse } from "./api.types";

export interface Rol {
  id_rol: string;
  rol: string;        // 'admin', 'ventas', 'bodega'
  descripcion: string;
}

/**
 * Respuesta para el listado de roles.
 * Como tu Backend usa findAll con QueryDto, la respuesta viene paginada.
 */
export type RolesPaginatedResponse = SuccessResponse<PaginatedResponse<Rol>>;

/**
 * Respuesta para un solo rol (por si lo necesitas en algún momento)
 */
export type RolSingleResponse = SuccessResponse<Rol>;