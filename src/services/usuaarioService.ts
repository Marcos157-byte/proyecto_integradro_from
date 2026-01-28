import client from "../api/client";
import type { SuccessResponse } from "../types/api.types";
import type { UsuarioPaginatedResponse, UsuarioSingleResponse } from "../types/usuario.type";

/**
 * Obtener todos los usuarios con paginación y filtros
 * @param params QueryDto (page, limit, search, etc.)
 */
export const obtenerUsuarios = async (params?: any): Promise<UsuarioPaginatedResponse> => {
  const { data } = await client.get<UsuarioPaginatedResponse>("/usuario", { params });
  return data;
};

/**
 * Obtener un usuario por su ID
 * @param id_usuario UUID del usuario
 */
export const obtenerUsuarioPorId = async (id_usuario: string): Promise<UsuarioSingleResponse> => {
  const { data } = await client.get<UsuarioSingleResponse>(`/usuario/${id_usuario}`);
  return data;
};

/**
 * Crear un nuevo usuario
 * @param usuarioData Datos del CreateUsuarioDto
 */
export const crearUsuario = async (usuarioData: any): Promise<UsuarioSingleResponse> => {
  const { data } = await client.post<UsuarioSingleResponse>("/usuario", usuarioData);
  return data;
};


 
export const actualizarUsuario = async (
  id_usuario: string, 
  usuarioData: any
): Promise<UsuarioSingleResponse> => {
  const { data } = await client.put<UsuarioSingleResponse>(`/usuario/${id_usuario}`, usuarioData);
  return data;
};

/**
 * Eliminar un usuario

 */
export const eliminarUsuario = async (id_usuario: string): Promise<SuccessResponse<null>> => {
  const { data } = await client.delete<SuccessResponse<null>>(`/usuario/${id_usuario}`);
  return data;
};