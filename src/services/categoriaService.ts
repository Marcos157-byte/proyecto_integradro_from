// services/categoriaService.ts (Mongo)
import client from "../api/client";

export async function createCategoria(categoria: any) {
  const { data } = await client.post("/categorias", categoria);
  return data.data; // 👈 devuelve el objeto creado
}

export async function listCategoria(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/categorias?page=${page}&limit=${limit}`);
  return {
    docs: data.data.docs,
    totalPages: data.data.totalPages,
    totalDocs: data.data.totalDocs,
    page: data.data.page,
    limit: data.data.limit
  };
}
