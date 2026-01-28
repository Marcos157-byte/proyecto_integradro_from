export type Producto = {
  id_producto: string;
  nombre: string;
  precio: number;
  stock_total: number;
  id_talla: string;
  id_categoria: string;
  activo: boolean;
  fecha_creacion: Date;
  
  // CORRECCIÓN: Nombres de propiedades consistentes
  color?: { 
    id_color: string; 
    color: string; // Cambiado de 'nombre_color' a 'color'
  };
  
  proveedor?: { 
    id_proveedor: string; 
    nombre_empresa: string; 
  };
  
  talla?: { 
    id_talla: string;
    nombre: string; // Cambiado de 'nombre_talla' a 'nombre'
    descripcion?: string; 
  };
  
  categoria?: { 
    id_categoria: string;
    nombre: string; // Cambiado de 'nombre_categoria' a 'nombre'
  };
};