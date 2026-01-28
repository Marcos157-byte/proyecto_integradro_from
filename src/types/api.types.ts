// Estructura general de tus respuestas de NestJS
export type SuccessResponse<T> = {
  totalDocs(totalDocs: any): unknown;
  success: boolean;
  message: string;
  data: T;
};

// Estructura para tablas con paginación
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export interface PaginatedResponseMongo<T> {
  docs: T[];           // Aquí es donde vive tu array de categorías
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
