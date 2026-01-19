import client from "../api/client";

// Listar todos los detalles de venta
export async function listVentaDetalles(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/venta-detalles?page=${page}&limit=${limit}`);

  // El backend devuelve directamente un array
  const docs = Array.isArray(data) ? data : [];

  return {
    docs,
    totalDocs: docs.length,
    page,
    limit,
    totalPages: Math.ceil(docs.length / limit),
  };
}

