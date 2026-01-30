import client from "../api/client";
import type { CajaSingleResponse, CreateCajaDto } from "../types/caja.types";

export const abrirCaja = async (dto: CreateCajaDto): Promise<CajaSingleResponse> => {
  // Enviamos el dto que ya contiene el monto_apertura como número
  const { data } = await client.post<CajaSingleResponse>("/caja/abrir", dto);
  return data;
};

export const getEstadoCaja = async (): Promise<CajaSingleResponse> => {
  const { data } = await client.get<CajaSingleResponse>("/caja/estado");
  return data;
};