// services/rolesService.ts
import client from "../api/client";

// Crear rol
export async function createRol(rol: { rol: string; descripcion: string }) {
  const { data } = await client.post("/roles", rol, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.data; // devuelve el objeto creado
}

// Listar roles con paginación
export async function listRoles(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/roles?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const payload = data.data; // { data: [...], total, page, limit }

  return {
    docs: Array.isArray(payload.data) ? payload.data : [],
    totalPages: Math.ceil((payload.total ?? 0) / (payload.limit ?? limit)),
    totalDocs: payload.total ?? 0,
    page: payload.page ?? page,
    limit: payload.limit ?? limit,
  };
}

// Obtener un rol por ID
export async function getRolById(id_rol: string) {
  const { data } = await client.get(`/roles/${id_rol}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.data;
}

// Actualizar rol
export async function updateRol(id_rol: string, rol: { rol?: string; descripcion?: string }) {
  const { data } = await client.put(`/roles/${id_rol}`, rol, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.data;
}

// Eliminar rol
export async function deleteRol(id_rol: string) {
  const { data } = await client.delete(`/roles/${id_rol}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.data;
}

