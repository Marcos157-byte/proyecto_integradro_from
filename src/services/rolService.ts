import client from "../api/client";
import type { RolesPaginatedResponse, RolSingleResponse } from "../types/rol.type";

const PATH = "/roles"; // En plural como indica tu error 404

export async function getRoles(page: number = 1, limit: number = 50): Promise<RolesPaginatedResponse> {
  const { data } = await client.get<RolesPaginatedResponse>(PATH, {
    params: { page, limit, sort: 'rol', order: 'ASC' }
  });
  return data;
}

export async function getRolById(id: string): Promise<RolSingleResponse> {
  const { data } = await client.get<RolSingleResponse>(`${PATH}/${id}`);
  return data;
}