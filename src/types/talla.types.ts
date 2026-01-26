import type { SuccessResponse, PaginatedResponseMongo } from "./api.types";

/**
 * Interfaz básica que refleja la clase Talla de NestJS/Mongoose
 */
export interface Talla {
  id_talla: string; // El UUID generado por uuidv4 en el Schema
  nombre: string;   // Ej: "L", "XL", "M"
}

/**
 * Respuesta para cuando pides una sola talla o creas una
 * NestJS devuelve: { success: true, message: "...", data: { Talla } }
 */
export type TallaResponse = SuccessResponse<Talla>;

/**
 * Respuesta completa para el listado de tallas usando el plugin de MongoDB
 * NestJS devuelve: { success: true, message: "...", data: { PaginatedResponseMongo } }
 */
export type TallasPaginadasResponse = SuccessResponse<PaginatedResponseMongo<Talla>>;