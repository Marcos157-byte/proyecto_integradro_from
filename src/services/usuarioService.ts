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
  // Usamos URLSearchParams para evitar el error 500 por mala formación de URL
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
    params.append("searchField", "nombre");
  }

  const { data } = await client.get<UsuariosPaginatedResponse>(
    `/usuario?${params.toString()}`, 
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