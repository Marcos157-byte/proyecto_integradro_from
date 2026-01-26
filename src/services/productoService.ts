import client from "../api/client";
import type { SuccessResponse, PaginatedResponse } from "../types/api.types";
import type { DashboardStats, StockAlerta } from "../types/dashboardAdmin.types";
import type { Producto } from "../types/producto.types";

const PATH = "/productos";

// Nota: He mantenido "listProductos" para que coincida con tu importación actual
export async function listProductos(page: number = 1, limit: number = 10, search?: string) {
  const { data } = await client.get<SuccessResponse<PaginatedResponse<Producto>>>(PATH, {
    params: { page, limit, search, searchField: 'nombre' }
  });

  const res = data.data;

  return {
    docs: res?.data || [],
    totalDocs: res?.total || 0,
    totalPages: res ? Math.ceil(res.total / res.limit) : 0,
    page: res?.page || 1,
    limit: res?.limit || 10,
  };
}

export async function updateProducto(id: string, dto: any): Promise<Producto> {
  // Aseguramos que los campos numéricos sean realmente números antes de enviarlos
  const payload = {
    ...dto,
    precio: dto.precio ? Number(String(dto.precio).replace(',', '.')) : 0,
    stock_total: dto.stock_total ? Number(dto.stock_total) : 0
  };

  const { data } = await client.put<SuccessResponse<Producto>>(`${PATH}/${id}`, payload);
  return data.data;
}

export async function createProducto(producto: any): Promise<Producto> {
  // Aplicamos la misma limpieza para la creación
  const payload = {
    ...producto,
    precio: producto.precio ? Number(String(producto.precio).replace(',', '.')) : 0,
    stock_total: producto.stock_total ? Number(producto.stock_total) : 0
  };

  const { data } = await client.post<SuccessResponse<Producto>>(PATH, payload);
  return data.data;
}

// Agregamos esta por si la necesitas luego
export async function deleteProducto(id: string): Promise<void> {
  await client.delete(`${PATH}/${id}`);
}
/**
 * KPIs del Dashboard
 */
/**
 * KPIs del Dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const { data } = await client.get<SuccessResponse<DashboardStats>>(`${PATH}/dashboard/stats`);
    // Retornamos data.data o un objeto por defecto si viene vacío
    return data.data || { totalProductos: 0, valorInventario: 0 };
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    // Devolvemos valores seguros para que el componente no se rompa
    return { totalProductos: 0, valorInventario: 0 };
  }
}

/**
 * Alertas de stock
 */
export async function getStockAlerts(): Promise<StockAlerta[]> {
  try {
    const { data } = await client.get<SuccessResponse<StockAlerta[]>>(`${PATH}/dashboard/stock-alerta`);
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error obteniendo alertas:", error);
    return [];
  }
}