import client from "../api/client";

export async function createColor(color: any) {
  const { data } = await client.post("/colores", color);
  return data.data; // el objeto creado está en data
}

export async function listColor(page: number = 1, limit: number = 10) {
  const { data } = await client.get(`/colores?page=${page}&limit=${limit}`);
  const payload = data?.data || {};

  return {
    docs: Array.isArray(payload.data) ? payload.data : [], // ✅ accede a data.data
    totalPages: Math.ceil((payload.total ?? 0) / (payload.limit ?? limit)),
    totalDocs: payload.total ?? 0,
    page: payload.page ?? page,
    limit: payload.limit ?? limit
  };
}

