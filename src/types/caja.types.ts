export interface CreateCajaDto {
  monto_apertura: number;
  id_usuario?: string; 
}

export interface Caja {
  id_caja: string;
  monto_apertura: number;
  estado: 'abierta' | 'cerrada';
  fecha_apertura: string;
}

// Adaptado a tu SuccessResponseDto del backend
export interface CajaSingleResponse {
  success: boolean;
  message: string;
  data: Caja;
}