import type { PaginatedResponse, SuccessResponse } from "./api.types";


export interface Rol {
  id_rol: string;
  nombre: string; // Ej: 'administrador', 'Ventas'
  descripcion?: string;
}

export interface RolUsuario {
  id_rolUsuario: string;
  rol: Rol;
}

export interface Empleado {
  id_empleado: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;
}

export interface Usuario {
  id_usuario: string;
  email: string;
  password?: string;
  activo: boolean;
  empleado: Empleado;
  rolUsuarios: RolUsuario[];
}

/**
 * Tipos de respuesta adaptados a tus genéricos de api.type.ts
 */

// Para obtener un solo usuario (findOne, create, update)
export type UsuarioSingleResponse = SuccessResponse<Usuario>;

// Para el listado paginado de usuarios (findAll)
export type UsuarioPaginatedResponse = SuccessResponse<PaginatedResponse<Usuario>>;