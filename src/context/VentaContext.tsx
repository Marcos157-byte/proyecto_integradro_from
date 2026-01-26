import React, { createContext, useState, useEffect } from "react";
import { getVentasPorPeriodo, getProductosMasVendidos } from "../services/ventaService";

export const VentaContext = createContext<any>(null);

export const VentaProvider = ({ children }) => {
  const [ventasDia, setVentasDia] = useState([]);
  const [ventasSemana, setVentasSemana] = useState([]);
  const [ventasMes, setVentasMes] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);

  useEffect(() => {
    getVentasPorPeriodo("dia").then(setVentasDia);
    getVentasPorPeriodo("semana").then(setVentasSemana);
    getVentasPorPeriodo("mes").then(setVentasMes);
    getProductosMasVendidos("mes").then(setProductosMasVendidos);
  }, []);

  return (
    <VentaContext.Provider value={{ ventasDia, ventasSemana, ventasMes, productosMasVendidos }}>
      {children}
    </VentaContext.Provider>
  );
};