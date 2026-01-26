// services/usuarioService.ts
import client from "../api/client";

// Crear usuario
export async function createUsuario(usuario: {
  nombre: string;
  email: string;
  password: string;
  id_empleado: string;
  rolesIds: string[];
}) {
  const { data } = await client.post("/usuario", usuario, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // token del admin
    },
  });
  return data.data; // devuelve el objeto creado
}

// Listar usuarios
export async function listUsuarios(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/usuario?page=${page}&limit=${limit}`, {
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

// Obtener un usuario por ID
export async function getUsuarioById(id_usuario: string) {
  const { data } = await client.get(`/usuario/${id_usuario}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.data;
}

// Actualizar usuario
export async function updateUsuario(id_usuario: string, usuario: any) {
  const { data } = await client.put(`/usuario/${id_usuario}`, usuario, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.data;
}

// Eliminar usuario
export async function deleteUsuario(id_usuario: string) {
  const { data } = await client.delete(`/usuario/${id_usuario}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.data;
}

