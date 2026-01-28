import type { SuccessResponse, PaginatedResponse } from "./api.types";
import type { Producto } from "./producto.types";

export type CreateVentaDetalleDto = {
  id_producto: string;
  cantidad: number;
};

export type CreateVentaDto = {
  id_cliente: string;
  id_usuario: string;
  metodoPago: string;
  ventasDetalles: CreateVentaDetalleDto[];
};

export interface VentaDetalleResponse {
  id_ventaDetalle: string;
  cantidad: number;
  precio_unitario: number;
  producto: Partial<Producto>; 
}

export interface VentaResponse {
  id_venta: string;
  fechaVenta: string; 
  metodoPago: string;
  subtotal: number;
  iva: number;
  total: number;
  cliente: {
    id_cliente: string;
    nombre_completo?: string;
    cedula?: string;
  };
  usuario: {
    id_usuario: string;
    nombre: string;
  };
  ventasDetalles: VentaDetalleResponse[];
}

// Adaptadores para las promesas de Axios
export type VentaSingleResponse = SuccessResponse<VentaResponse>;
export type VentaListResponse = SuccessResponse<PaginatedResponse<VentaResponse>>;

// Para el dashboard
export interface ResumenDashboardResponse {
  totalCaja: number;
  conteoVentas: number;
}