import client from "../api/client";

export async function createProveedor(proveedor: any) {
  const { data } = await client.post("/proveedores", proveedor);
  return data.data;
}

export async function listProveedor(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/proveedores?page=${page}&limit=${limit}`);
  const payload = data?.data || {};

  return {
    docs: Array.isArray(payload.data) ? payload.data : [], // ✅ accede a data.data
    totalPages: Math.ceil((payload.total ?? 0) / (payload.limit ?? limit)),
    totalDocs: payload.total ?? 0,
    page: payload.page ?? page,
    limit: payload.limit ?? limit
  };
}
