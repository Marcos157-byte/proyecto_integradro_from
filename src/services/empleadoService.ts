// services/empleadoService.ts
import client from "../api/client";

// Crear empleado
export async function createEmpleado(empleado: {
  nombre: string;
  segundoNombre?: string;
  apellido: string;
  segundoApellido: string;
  cedula: string;
  direccion: string;
  telefono: string;
  genero: string;
  edad: number;
  fechaNacimiento: string; // 👈 en frontend lo manejas como string ISO
}) {
  const { data } = await client.post("/empleados", empleado, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data.data; // devuelve el objeto creado
}

// Listar empleados con paginación y búsqueda
export async function listEmpleados(page: number = 1, limit: number = 10, search?: string) {
  const query = search ? `&search=${search}&searchField=nombre` : "";
  const { data } = await client.get(`/empleados?page=${page}&limit=${limit}${query}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    docs: Array.isArray(data.data) ? data.data : [],
    totalPages: Math.ceil((data.total ?? 0) / (data.limit ?? limit)),
    totalDocs: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
}

// Obtener un empleado por ID
export async function getEmpleadoById(id_empleado: string) {
  const { data } = await client.get(`/empleados/${id_empleado}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data.data;
}

// Actualizar empleado
export async function updateEmpleado(id_empleado: string, empleado: any) {
  const { data } = await client.put(`/empleados/${id_empleado}`, empleado, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data.data;
}

// Eliminar empleado
export async function deleteEmpleado(id_empleado: string) {
  const { data } = await client.delete(`/empleados/${id_empleado}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data.data;
}

// Buscar empleados por nombre (usando tu nuevo endpoint)
export async function buscarEmpleadoPorNombre(nombre: string) {
  const { data } = await client.get(`/empleados/buscar?nombre=${nombre}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return data.data;
}