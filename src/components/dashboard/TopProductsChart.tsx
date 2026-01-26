import { Paper, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#3a7afe", "#4f46e5", "#6366f1", "#818cf8", "#93c5fd"];

export default function TopProductsChart({ data }: { data: any[] }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: 400 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Jeans Más Vendidos</Typography>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis dataKey="nombre" type="category" width={100} style={{ fontSize: '12px' }} />
          <Tooltip cursor={{fill: 'transparent'}} />
          <Bar dataKey="total_vendido" radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}