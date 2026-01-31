import type { SuccessResponse, PaginatedResponse } from "./api.types";
import type { Empleado } from "./empleado.type";

/**
 * Representa la estructura del Usuario (como viene del backend)
 */
export interface Usuario {
  id_usuario: string;
  nombre: string;
  email: string;
  password?: string; // Opcional porque el backend suele ocultarlo en GET
  activo: boolean;
  empleado: Empleado; // Incluye el objeto empleado completo
  rolUsuarios?: RolUsuario[];
}

/**
 * Estructura de la relación intermedia con Roles
 */
export interface RolUsuario {
  id_rol_usuario: string;
  rol: {
    id_rol: string;
    nombre: string; // Ejemplo: 'administrador'
  };
}

/**
 * Datos para CREAR un usuario (lo que enviaste en Postman)
 */
export interface CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  id_empleado: string;   // UUID del empleado asignado
  rolesIds: string[];    // Array de IDs de roles
}

/**
 * Datos para ACTUALIZAR un usuario
 */
export type UpdateUsuarioDto = Partial<CreateUsuarioDto> & { activo?: boolean };

/**
 * Respuestas del Servidor
 */
export type UsuarioResponse = SuccessResponse<Usuario>;
export type UsuariosPaginatedResponse = SuccessResponse<PaginatedResponse<Usuario>>;