import client from "../api/client";
import type { 
  Usuario, 
  CreateUsuarioDto, 
  UsuarioResponse, 
  UsuariosPaginatedResponse 
} from "../types/usuario.type";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export async function createUsuario(usuario: CreateUsuarioDto): Promise<Usuario> {
  const { data } = await client.post<UsuarioResponse>("/usuario", usuario, getAuthHeaders());
  return data.data;
}

export async function listUsuarios(page: number = 1, limit: number = 10, search?: string) {
  const query = search ? `&search=${search}&searchField=nombre` : "";
  const { data } = await client.get<UsuariosPaginatedResponse>(
    `/usuario?page=${page}&limit=${limit}${query}`, 
    getAuthHeaders()
  );

  return {
    docs: data.data.data || [],
    totalDocs: data.data.total,
    page: data.data.page,
    limit: data.data.limit,
  };
}

export async function deleteUsuario(id_usuario: string): Promise<void> {
  await client.delete(`/usuario/${id_usuario}`, getAuthHeaders());
}