export type DashboardStats = {
  totalProductos: number;
  stockCritico: number;
  valorInventario: number;
  masVendidos: {
    nombre: string;
    totalVendido: string;
  }[];
};

export type StockAlerta = {
  nombre: string;
  stock: number;
  talla: string;
};