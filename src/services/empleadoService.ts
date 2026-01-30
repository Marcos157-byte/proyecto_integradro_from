import client from "../api/client";
import type { SuccessResponse } from "../types/api.types";
import type { 
  Empleado, 
  CreateEmpleadoDto, 
  UpdateEmpleadoDto, 
  EmpleadoResponse, 
  EmpleadosPaginatedResponse 
} from "../types/empleado.type";

// Definimos la ruta base como constante
const PATH = "/empleados";

// Helper para obtener el token centralizado
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Crear empleado
export async function createEmpleado(empleado: CreateEmpleadoDto): Promise<Empleado> {
  const { data } = await client.post<EmpleadoResponse>(PATH, empleado, getAuthHeaders());
  return data.data; 
}

// Listar empleados con paginación y búsqueda utilizando params de Axios
export async function listEmpleados(page: number = 1, limit: number = 10, search?: string) {
  const { data } = await client.get<EmpleadosPaginatedResponse>(PATH, {
    ...getAuthHeaders(),
    params: {
      page,
      limit,
      search: search || undefined,
      searchField: search ? "nombre" : undefined
    }
  });

  const res = data.data;

  return {
    docs: res.data || [],
    totalDocs: res.total,
    totalPages: Math.ceil(res.total / res.limit),
    page: res.page,
    limit: res.limit,
  };
}

// Obtener un empleado por ID
export async function getEmpleadoById(id_empleado: string): Promise<Empleado> {
  const { data } = await client.get<EmpleadoResponse>(`${PATH}/${id_empleado}`, getAuthHeaders());
  return data.data;
}

// Actualizar empleado
export async function updateEmpleado(id_empleado: string, empleado: UpdateEmpleadoDto): Promise<Empleado> {
  const { data } = await client.put<EmpleadoResponse>(`${PATH}/${id_empleado}`, empleado, getAuthHeaders());
  return data.data;
}

// Eliminar empleado
export async function deleteEmpleado(id_empleado: string): Promise<void> {
  await client.delete(`${PATH}/${id_empleado}`, getAuthHeaders());
}

// Buscar empleados por nombre
export async function buscarEmpleadoPorNombre(nombre: string): Promise<Empleado[]> {
  const { data } = await client.get<SuccessResponse<Empleado[]>>(
    `${PATH}/buscar`, 
    {
      ...getAuthHeaders(),
      params: { nombre }
    }
  );
  return data.data;
}