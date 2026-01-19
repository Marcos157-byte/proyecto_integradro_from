// services/tallaService.ts (Mongo)
import client from "../api/client";

export async function createTalla(talla: any) {
  const { data } = await client.post("/tallas", talla);
  return data; // 👈 devuelve el objeto creado
}

export async function listTalla(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/tallas?page=${page}&limit=${limit}`);
  return {
    docs: data.data.docs,
    totalPages: data.data.totalPages,
    totalDocs: data.data.totalDocs,
    page: data.data.page,
    limit: data.data.limit
  };
}