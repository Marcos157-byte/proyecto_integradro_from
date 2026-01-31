import type { SuccessResponse } from "./api.types";

// Lo que el cajero ve mientras la caja está abierta
export interface CajaActivaResumen {
  id_caja: string;
  fecha_apertura: string;
  monto_apertura: number;
  ventas_efectivo: number;
  monto_esperado: number;
  total_transacciones: number;
}

// Lo que el backend devuelve al cerrar la caja
export interface ArqueoCierre {
  inicio: number;
  ventas_efectivo: number;
  total_esperado: number;
  contado_fisico: number;
  diferencia: number;
  resultado: string; // "Caja Cuadrada", "Faltante" o "Sobrante"
}

export interface ResumenCierreResponse {
  resumen: ArqueoCierre;
}

// Tipos para las respuestas de Axios
export type CajaEstadoResponse = SuccessResponse<CajaActivaResumen | null>;
export type CajaCierreResponse = SuccessResponse<ResumenCierreResponse>;