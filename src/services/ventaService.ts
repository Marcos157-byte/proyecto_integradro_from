import client from "../api/client";
import type { SuccessResponse, PaginatedResponse } from "../types/api.types";
import type { 
  CreateVentaDto, 
  VentaResponse, 
  ResumenDashboardResponse 
} from "../types/venta.types";

const PATH = "/venta";

/**
 * FUNCIONES PARA EL VENDEDOR (OPERATIVAS)
 */

// 1. Obtener el resumen del dashboard (Estado de caja y total del día)
export async function getResumenDashboard(): Promise<ResumenDashboardResponse> {
  const { data } = await client.get<SuccessResponse<ResumenDashboardResponse>>(`${PATH}/dashboard/resumen`);
  return data.data; 
}

// 2. Obtener productos más vendidos por el vendedor actual
export async function getTopProductosVendedor(periodo: string = 'dia') {
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/stats/top-productos`, {
    params: { periodo }
  });
  return data.data;
}

// 3. Registrar una nueva transacción (Venta)
export async function registrarVenta(ventaData: CreateVentaDto): Promise<VentaResponse> {
  const { data } = await client.post<SuccessResponse<VentaResponse>>(PATH, ventaData);
  return data.data;
}

// 4. Listar historial propio del vendedor (Solo sus ventas)
export async function listarMisVentas(page = 1, limit = 10): Promise<PaginatedResponse<VentaResponse>> {
  const { data } = await client.get<SuccessResponse<PaginatedResponse<VentaResponse>>>(
    `${PATH}/mis-ventas`, 
    { params: { page, limit } }
  );
  return data.data;
}

/**
 * FUNCIONES PARA EL ADMINISTRADOR (REPORTES Y AUDITORÍA)
 */

// 1. Obtener el reporte de ventas por rango de fechas (Para el componente Reportes.tsx)
// Esta función ahora usa 'client' y está lista para ser importada
export async function getReporteVentas(inicio: string, fin: string): Promise<any[]> {
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/reporte/rango`, {
    params: { desde: inicio, hasta: fin }
  });
  return data.data;
}

// 2. Obtener el ranking general de todos los vendedores
export async function getRankingVendedores(): Promise<any[]> {
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/reporte/ranking`);
  return data.data;
}

// 3. Obtener las ventas de un usuario específico (Auditoría)
export async function getVentasPorUsuario(id_usuario: string): Promise<any[]> {
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/reporte/usuario/${id_usuario}`);
  return data.data;
}

// 4. Listar todas las ventas del sistema sin excepción
export async function listarTodasLasVentas(page = 1, limit = 10): Promise<PaginatedResponse<VentaResponse>> {
  const { data } = await client.get<SuccessResponse<PaginatedResponse<VentaResponse>>>(
    `${PATH}`, 
    { params: { page, limit } }
  );
  return data.data;
}

// 5. Eliminar una venta (Acceso restringido)
export async function eliminarVenta(id_venta: string): Promise<void> {
  await client.delete(`${PATH}/${id_venta}`);
}