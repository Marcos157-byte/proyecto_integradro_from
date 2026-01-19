// services/productoService.ts (Postgres)
import client from "../api/client";

export async function createProducto(producto: any) {
  const { data } = await client.post("/productos", producto);
  return data.data; // 👈 devuelve el objeto creado
}

export async function listProducto(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/productos?page=${page}&limit=${limit}`);

  return {
    docs: Array.isArray(data.data) ? data.data : [],
    totalPages: Math.ceil((data.total ?? 0) / (data.limit ?? limit)),
    totalDocs: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
}