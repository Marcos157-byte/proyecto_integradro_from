import client from "../api/client";
import type { SuccessResponse } from "../types/api.types";
import type { 
  Empleado, 
  CreateEmpleadoDto, 
  UpdateEmpleadoDto, 
  EmpleadoResponse, 
  EmpleadosPaginatedResponse 
} from "../types/empleado.type";

const PATH = "/empleados";

/**
 * SERVICIO DE GESTIÓN DE EMPLEADOS
 */
// Agrega esto a tu ventaService.ts
export async function getTopProductos(periodo: string = 'dia') {
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/stats/top-productos`, {
    params: { periodo }
  });
  return data.data; // Esto devuelve el array de productos más vendidos
}
// 1. Listar empleados con paginación y búsqueda
export async function listEmpleados(page: number = 1, limit: number = 10, search?: string) {
  const { data } = await client.get<EmpleadosPaginatedResponse>(PATH, {
    params: {
      page,
      limit,
      search: search || undefined,
      searchField: search ? "nombre" : undefined
    }
  });

  // Extraemos la información del SuccessResponseDto
  const res = data.data;

  return {
    docs: res.data || [],
    totalDocs: res.total,
    totalPages: Math.ceil(res.total / res.limit),
    page: res.page,
    limit: res.limit,
  };
}

// 2. Crear un nuevo empleado
export async function createEmpleado(empleado: CreateEmpleadoDto): Promise<Empleado> {
  const { data } = await client.post<EmpleadoResponse>(PATH, empleado);
  return data.data; 
}

// 3. Obtener un empleado por su ID
export async function getEmpleadoById(id_empleado: string): Promise<Empleado> {
  const { data } = await client.get<EmpleadoResponse>(`${PATH}/${id_empleado}`);
  return data.data;
}

// 4. Actualizar datos de un empleado
export async function updateEmpleado(id_empleado: string, empleado: UpdateEmpleadoDto): Promise<Empleado> {
  const { data } = await client.put<EmpleadoResponse>(`${PATH}/${id_empleado}`, empleado);
  return data.data;
}

// 5. Eliminar un empleado
export async function deleteEmpleado(id_empleado: string): Promise<void> {
  await client.delete(`${PATH}/${id_empleado}`);
}

// 6. Buscar empleados por nombre (Ruta específica)
export async function buscarEmpleadoPorNombre(nombre: string): Promise<Empleado[]> {
  const { data } = await client.get<SuccessResponse<Empleado[]>>(
    `${PATH}/buscar`, 
    { params: { nombre } }
  );
  return data.data;
}