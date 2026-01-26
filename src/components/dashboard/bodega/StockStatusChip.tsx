import { Chip, alpha } from "@mui/material";

interface StockStatusChipProps {
  stock: number;
  stockMinimo?: number; // Opcional, por si quieres comparar contra un límite real
}

export default function StockStatusChip({ stock, stockMinimo = 10 }: StockStatusChipProps) {
  // Lógica de estados
  let label = "";
  let color: "success" | "warning" | "error" | "default" = "default";
  
  if (stock <= 0) {
    label = "Agotado";
    color = "error";
  } else if (stock <= stockMinimo) {
    label = "Stock Bajo";
    color = "warning";
  } else {
    label = "Disponible";
    color = "success";
  }

  return (
    <Chip 
      label={label} 
      color={color}
      size="small"
      sx={{ 
        fontWeight: 700, 
        minWidth: 90,
        // Un toque de estilo: fondo más suave y texto fuerte
        backgroundColor: (theme) => alpha(theme.palette[color].main, 0.1),
        color: (theme) => theme.palette[color].dark,
        border: `1px solid`,
        borderColor: (theme) => alpha(theme.palette[color].main, 0.3),
      }} 
    />
  );
}