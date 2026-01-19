import client from "../api/client";

// Crear cliente
export async function createCliente(cliente: any) {
  const { data } = await client.post("/clientes", cliente);
  return data.data; // Devuelve el cliente creado
}

// Listar clientes con paginación
export async function listClientes(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/clientes?page=${page}&limit=${limit}`);

  const docs = Array.isArray(data.data?.data) ? data.data.data : [];

  return {
    docs,
    totalPages: Math.ceil((data.data?.total ?? 0) / (data.data?.limit ?? limit)),
    totalDocs: data.data?.total ?? 0,
    page: data.data?.page ?? page,
    limit: data.data?.limit ?? limit,
  };
}