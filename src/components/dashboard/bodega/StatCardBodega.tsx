import { Paper, Box, Typography, alpha, useTheme } from "@mui/material";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string; // Por si quieres poner algo como "+5 hoy"
  color?: string; // Color principal de la tarjeta
}

export default function StatCardBodega({ title, value, icon, trend, color }: StatCardProps) {
  const theme = useTheme();
  const primaryColor = color || theme.palette.primary.main;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 10px 20px ${alpha(primaryColor, 0.1)}`,
        },
      }}
    >
      {/* Círculo del Icono */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: 3,
          backgroundColor: alpha(primaryColor, 0.1),
          color: primaryColor,
        }}
      >
        {icon}
      </Box>

      {/* Textos */}
      <Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: "text.secondary", 
            fontWeight: 600, 
            textTransform: "uppercase",
            letterSpacing: 0.5
          }}
        >
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
          {value}
        </Typography>
        {trend && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: trend.includes('+') ? "success.main" : "error.main", 
              fontWeight: 700 
            }}
          >
            {trend}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}