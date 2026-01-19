import client from "../api/client";

// Crear venta
export async function createVenta(venta: any) {
  const { data } = await client.post("/venta", venta);
  return data.data; // Devuelve la venta creada
}

// Listar ventas
export async function listVentas(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/venta?page=${page}&limit=${limit}`);
  return {
    docs: Array.isArray(data.data) ? data.data : [],
    totalPages: Math.ceil((data.total ?? 0) / (data.limit ?? limit)),
    totalDocs: data.total ?? 0,
    page: data.page ?? page,
    limit: data.limit ?? limit,
  };
}