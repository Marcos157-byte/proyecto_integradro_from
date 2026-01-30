import React from "react";
import { Box, Typography } from "@mui/material";

interface TicketProps {
  venta: any | null;
}

export const TicketVenta = React.forwardRef<HTMLDivElement, TicketProps>(({ venta }, ref) => {
  if (!venta) return null;

  return (
    <Box
      ref={ref}
      sx={{
        width: "48mm", // Ajuste para papel de 58mm
        p: 0,
        m: 0,
        backgroundColor: "white",
        color: "black",
        fontFamily: "'Courier New', Courier, monospace", // Fuente estándar térmica
        lineHeight: 1.2,
      }}
      className="printable-area"
    >
      <Typography variant="body2" align="center" sx={{ fontWeight: "bold", fontSize: "14px" }}>
        MI TIENDA
      </Typography>
      <Typography sx={{ fontSize: "10px" }} align="center">RUC: 123456789001</Typography>
      
      <Box sx={{ my: 1, borderBottom: "1px dashed black" }} />

      <Typography sx={{ fontSize: "10px" }}>FECHA: {new Date().toLocaleString()}</Typography>
      <Typography sx={{ fontSize: "10px" }}>CLIENTE: {venta.cliente?.nombre || "C. FINAL"}</Typography>

      <Box sx={{ my: 1, borderBottom: "1px dashed black" }} />

      {venta.detalles?.map((item: any, index: number) => (
        <Box key={index} sx={{ mb: 0.5 }}>
          <Typography sx={{ fontSize: "10px", textTransform: "uppercase" }}>{item.producto.nombre}</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "10px" }}>{item.cantidad} x ${item.precio_unitario}</Typography>
            <Typography sx={{ fontSize: "10px" }}>${(item.cantidad * item.precio_unitario).toFixed(2)}</Typography>
          </Box>
        </Box>
      ))}

      <Box sx={{ my: 1, borderBottom: "1px dashed black" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>TOTAL:</Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>${venta.total?.toFixed(2)}</Typography>
      </Box>

      <Typography sx={{ fontSize: "10px", mt: 2 }} align="center">¡Gracias por su compra!</Typography>
      <Box sx={{ height: "15mm" }} /> {/* Espacio para el corte de papel */}
    </Box>
  );
});

TicketVenta.displayName = "TicketVenta";