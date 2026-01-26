// Respuesta de productos más vendidos
export type ProductoMasVendidoDto = {
  producto: string;         // nombre del producto
  cantidadVendida: string;  // total vendido (string porque viene de SQL SUM)
};

// Respuesta genérica del backend
export type SuccessResponseDto<T = any> = {
  success: boolean;
  message: string;
  data: T;
};