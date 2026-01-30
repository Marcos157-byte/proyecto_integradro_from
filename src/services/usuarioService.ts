import client from "../api/client";
import type { 
  Usuario, 
  CreateUsuarioDto, 
  UsuarioResponse, 
  UsuariosPaginatedResponse 
} from "../types/usuario.type";

// Configuración de cabeceras con el Token de sesión
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/**
 * Crea un nuevo usuario en el sistema
 */
export async function createUsuario(usuario: CreateUsuarioDto): Promise<Usuario> {
  const { data } = await client.post<UsuarioResponse>("/usuario", usuario, getAuthHeaders());
  return data.data;
}

/**
 * Actualiza un usuario existente (Edición)
 */
export async function updateUsuario(id: string, usuario: Partial<CreateUsuarioDto>): Promise<Usuario> {
  const { data } = await client.patch<UsuarioResponse>(`/usuario/${id}`, usuario, getAuthHeaders());
  return data.data;
}

/**
 * Lista los usuarios con paginación y filtros
 */
export async function listUsuarios(page: number = 1, limit: number = 10, search?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
    params.append("searchField", "email"); // Se usa email para evitar el error 500 del servidor
  }

  const { data } = await client.get<UsuariosPaginatedResponse>(
    `/usuario?${params.toString()}`, 
    getAuthHeaders()
  );

  return {
    docs: data.data.data || [], 
    totalDocs: data.data.total || 0,
    page: data.data.page || 1,
    limit: data.data.limit || 10,
  };
}

/**
 * Elimina un usuario por su ID
 */
export async function deleteUsuario(id: string): Promise<void> {
  await client.delete(`/usuario/${id}`, getAuthHeaders());
}