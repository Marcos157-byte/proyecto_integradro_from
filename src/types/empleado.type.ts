import type { SuccessResponse, PaginatedResponse } from "./api.types";

export interface Empleado {
  id_empleado: string;
  nombre: string;
  segundoNombre?: string | null; 
  apellido: string;
  segundoApellido: string;
  cedula: string;
  direccion: string;
  telefono: string;
  genero: string;
  edad: number;
  fechaNacimiento: string;
  estado: boolean;
  fechaCreacion: string;
  cargo?: string; // Añadido para tu tabla
  usuario?: {
    email: string;
    rolUsuarios: Array<{
      rol: {
        id_rol: string;
        rol: string;
      }
    }>;
  };
}

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
  fechaNacimiento: string;
  cargo?: string; // Opcional en creación
}

export type UpdateEmpleadoDto = Partial<CreateEmpleadoDto>;

// Respuestas
export type EmpleadoResponse = SuccessResponse<Empleado>;
export type EmpleadosPaginatedResponse = SuccessResponse<PaginatedResponse<Empleado>>;