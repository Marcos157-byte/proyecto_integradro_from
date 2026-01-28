import client from "../api/client";
import type { SuccessResponse, PaginatedResponse } from "../types/api.types";
import type { 
  CreateVentaDto, 
  VentaResponse, 
  ResumenDashboardResponse 
} from "../types/venta.types";

const PATH = "/venta";

/**
 * 1. Obtiene el resumen del turno (Total Caja y Conteo)
 */
export async function getResumenDashboard(id_usuario: string): Promise<ResumenDashboardResponse> {
  const { data } = await client.get<SuccessResponse<ResumenDashboardResponse>>(`${PATH}/dashboard/resumen`, {
    params: { id_usuario }
  });
  return data.data; 
}

/**
 * 2. Obtiene el Top de Productos vendidos
 */
export async function getTopProductosVendedor(id_usuario: string, periodo: string = 'dia') {
  // Aquí usamos 'any' o un tipo específico si lo creas para el top
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/stats/top-productos`, {
    params: { id_usuario, periodo }
  });
  return data.data;
}

/**
 * 3. Registrar una nueva venta
 */
export async function registrarVenta(ventaData: CreateVentaDto): Promise<VentaResponse> {
  const { data } = await client.post<SuccessResponse<VentaResponse>>(PATH, ventaData);
  return data.data;
}

/**
 * 4. Listar historial de ventas (Paginado)
 */
export async function listarVentas(page = 1, limit = 10, search?: string) {
  // Usamos PaginatedResponse para que sepa que viene 'total', 'page', 'limit' y 'data'
  const { data } = await client.get<SuccessResponse<PaginatedResponse<VentaResponse>>>(PATH, {
    params: { page, limit, search }
  });
  return data.data;
}