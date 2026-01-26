// Detalle de cada producto en la venta
export type VentaDetalleDto = {
  id_producto: string;
  cantidad: number;
  precio_unitario?: number; // opcional, lo calcula el back
};

// Venta completa
export type VentaDto = {
  id_venta: string;
  fechaVenta: string;
  metodoPago: string;
  subtotal: number;
  iva: number;
  total: number;
  id_cliente: string;
  id_usuario: string;
  ventasDetalles: VentaDetalleDto[];
};

// Respuesta genérica del backend
export type SuccessResponseDto<T = any> = {
  success: boolean;
  message: string;
  data: T;
};

// Paginación
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

