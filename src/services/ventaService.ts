import client from "../api/client";
import type { VentaDto, SuccessResponseDto, PaginatedResponse } from "../types/venta.dto";

// Crear venta
export async function createVenta(payload: Omit<VentaDto, "id_venta" | "fechaVenta" | "subtotal" | "iva" | "total">): Promise<VentaDto> {
  const { data } = await client.post<SuccessResponseDto<VentaDto>>("/ventas", payload);
  return data.data;
}

// Listar ventas con paginación
export async function listVentas(page: number = 1, limit: number = 10): Promise<PaginatedResponse<VentaDto>> {
  const { data } = await client.get<SuccessResponseDto<PaginatedResponse<VentaDto>>>(`/ventas?page=${page}&limit=${limit}`);
  return data.data;
}

// Obtener una venta por ID
export async function getVenta(id: string): Promise<VentaDto> {
  const { data } = await client.get<SuccessResponseDto<VentaDto>>(`/ventas/${id}`);
  return data.data;
}

// Actualizar venta
export async function updateVenta(id: string, payload: Partial<VentaDto>): Promise<VentaDto> {
  const { data } = await client.put<SuccessResponseDto<VentaDto>>(`/ventas/${id}`, payload);
  return data.data;
}

// Eliminar venta
export async function deleteVenta(id: string): Promise<null> {
  const { data } = await client.delete<SuccessResponseDto<null>>(`/ventas/${id}`);
  return data.data;
}

// Reporte: productos más vendidos
export async function getProductosMasVendidos(periodo: "dia" | "semana" | "mes") {
  const { data } = await client.get<SuccessResponseDto<any>>(`/venta/reportes/productos?periodo=${periodo}`);
  return data.data;
}
export async function getVentasPorPeriodo(periodo: "dia" | "semana" | "mes") {
  const { data } = await client.get(`/venta/ventas?periodo=${periodo}`);
  return data.data; // devuelve el array con periodo y totalVentas
}

// Ventas agrupadas por todos los periodos
export async function getVentasTodosPeriodos() {
  const { data } = await client.get(`/venta/ventas-todos`);
  return data.data; // devuelve { dia, semana, mes }
}