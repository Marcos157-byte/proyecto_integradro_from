import { Grid, Paper, Typography, Box, alpha } from "@mui/material";
import { Inventory, AttachMoney, Warning } from "@mui/icons-material";

interface Props {
  stats: {
    totalProductos: number;
    stockCritico: number;
    valorInventario: number;
  };
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    { title: "Valor Inventario", value: `$${stats.valorInventario}`, icon: <AttachMoney />, color: "#10b981" },
    { title: "Productos Totales", value: stats.totalProductos, icon: <Inventory />, color: "#3a7afe" },
    { title: "Stock Crítico", value: stats.stockCritico, icon: <Warning />, color: "#ef4444" },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 4 }}  key={index}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: alpha(card.color, 0.1), color: card.color, p: 2, borderRadius: 3, mr: 2 }}>
              {card.icon}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{card.title}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{card.value}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}