import client from "../api/client";
import type { CajaEstadoResponse, CajaCierreResponse } from "../types/caja.types";

const PATH = "/caja";

// 1. Ver si hay caja abierta al cargar la página
export const getEstadoCaja = async (): Promise<CajaEstadoResponse> => {
  const { data } = await client.get(`${PATH}/estado-actual`);
  return data; // Retorna el SuccessResponse completo
};

// 2. Abrir la caja (Enviamos el monto como número)
export const abrirCaja = async (monto_apertura: number) => {
  const { data } = await client.post(`${PATH}/abrir`, { 
    monto_apertura: Number(monto_apertura) 
  });
  return data;
};

// 3. Cerrar la caja y recibir el arqueo
export const cerrarCaja = async (monto_cierre: number): Promise<CajaCierreResponse> => {
  const { data } = await client.post(`${PATH}/cerrar`, { 
    monto_cierre: Number(monto_cierre) 
  });
  return data;
};