export type Producto = {
  id_producto: string;
  nombre: string;
  precio: number;
  stock_total: number;
  id_talla: string;      // ID que vincula con Mongo
  id_categoria: string;  // ID que vincula con Mongo
  activo: boolean;
  fecha_creacion: Date;
  
  // Relaciones de Postgres
  color?: { id_color: number; nombre_color: string };
  proveedor?: { id_proveedor: number; nombre_empresa: string };
  
  // Relaciones de Mongo (enriquecidas en el service)
  talla?: { nombre_talla: string; descripcion?: string };
  categoria?: { nombre_categoria: string };
};