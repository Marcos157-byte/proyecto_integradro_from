import client from "../api/client";
import type { SuccessResponse, PaginatedResponse } from "../types/api.types";
import type { 
  CreateVentaDto, 
  VentaResponse, 
  ResumenDashboardResponse 
} from "../types/venta.types";

const PATH = "/venta";

export async function getResumenDashboard(id_usuario: string): Promise<ResumenDashboardResponse> {
  const { data } = await client.get<SuccessResponse<ResumenDashboardResponse>>(`${PATH}/dashboard/resumen`, {
    params: { id_usuario }
  });
  return data.data; 
}

export async function getTopProductosVendedor(id_usuario: string, periodo: string = 'dia') {
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/stats/top-productos`, {
    params: { id_usuario, periodo }
  });
  return data.data;
}

export async function registrarVenta(ventaData: CreateVentaDto): Promise<VentaResponse> {
  const { data } = await client.post<SuccessResponse<VentaResponse>>(PATH, ventaData);
  return data.data;
}

export async function listarMisVentas(page = 1, limit = 10) {
  const { data } = await client.get<SuccessResponse<PaginatedResponse<VentaResponse>>>(
    `${PATH}/mis-ventas`, 
    { params: { page, limit } }
  );
  return data.data;
}

// FUNCIONES PARA EL ADMIN
export async function getRankingVendedores(): Promise<any[]> {
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/reporte/ranking`);
  return data.data;
}

export async function getVentasPorUsuario(id_usuario: string): Promise<any[]> {
  const { data } = await client.get<SuccessResponse<any[]>>(`${PATH}/reporte/usuario/${id_usuario}`);
  return data.data;
}

export async function listarTodasLasVentas(page = 1, limit = 10): Promise<PaginatedResponse<VentaResponse>> {
  const { data } = await client.get<SuccessResponse<PaginatedResponse<VentaResponse>>>(
    `${PATH}`, 
    { params: { page, limit } }
  );
  return data.data;
}