import type { SuccessResponse, PaginatedResponse } from "./api.types";

/**
 * Representa la estructura exacta del Empleado que recibes del Backend
 */
export interface Empleado {
  id_empleado: string;
  nombre: string;
  segundoNombre: string | null; 
  apellido: string;
  segundoApellido: string;
  cedula: string;
  direccion: string;
  telefono: string;
  genero: string;
  edad: number;
  fechaNacimiento: string; // Recibes: "1997-03-22T00:00:00.000Z"
  estado: boolean;
  fechaCreacion: string;   // Recibes: "2026-01-02T19:20:59.994Z"
  usuarios?: any[];        // Relación OneToMany (opcional)
}

/**
 * Lo que envías en el cuerpo (Body) del POST para crear
 * Basado en tu prueba de Postman
 */
export interface CreateEmpleadoDto {
  nombre: string;
  segundoNombre?: string;
  apellido: string;
  segundoApellido: string;
  cedula: string;
  direccion: string;
  telefono: string;
  genero: string;
  edad: number;
  fechaNacimiento: string; // Envías: "1997-03-22"
}

/**
 * Lo que envías para actualizar (PUT / PATCH)
 * Todos los campos de creación se vuelven opcionales
 */
export type UpdateEmpleadoDto = Partial<CreateEmpleadoDto>;

/** * Tipos de Respuesta para tus servicios de React (Axios/Fetch)
 */

// Para: GET /empleados/:id  o  POST /empleados
export type EmpleadoResponse = SuccessResponse<Empleado>;

// Para: GET /empleados (con paginación)
export type EmpleadosPaginatedResponse = SuccessResponse<PaginatedResponse<Empleado>>;