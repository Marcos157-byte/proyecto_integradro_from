import  { useMemo } from "react";
import {
  Drawer, List, ListItemIcon, ListItemText, ListItemButton,
  Box, Typography, Divider, alpha, 
  useTheme, useMediaQuery, IconButton
} from "@mui/material";
import {
  PointOfSaleRounded as PointOfSaleIcon,
  ReceiptLongRounded as ListAltIcon,
  PeopleAltRounded as PeopleIcon,
  Inventory2Rounded as InventoryIcon,
  AccountBalanceWalletRounded as CashIcon,
  ChevronLeftRounded as ChevronLeftIcon,
  StorefrontRounded as StoreIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_CLOSED = 88;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function SidebarVentas({ open, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuGroups = useMemo(() => [
    {
      title: "Punto de Venta",
      items: [
        { text: "Nueva Venta", icon: <PointOfSaleIcon />, path: "/ventas/nueva" },
        { text: "Historial Ventas", icon: <ListAltIcon />, path: "/ventas/lista" },
        { text: "Control de Caja", icon: <CashIcon />, path: "/ventas/caja" },
      ]
    },
    {
      title: "Catálogos",
      items: [
        { text: "Mis Clientes", icon: <PeopleIcon />, path: "/ventas/clientes" },
        { text: "Consultar Stock", icon: <InventoryIcon />, path: "/ventas/inventario" },
      ]
    }
  ], []);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) onToggle();
  };

  return (
    <Drawer 
      variant={isMobile ? "temporary" : "permanent"} 
      open={open} 
      onClose={onToggle}
      PaperProps={{
        sx: {
          width: open ? DRAWER_WIDTH : (isMobile ? 0 : DRAWER_WIDTH_CLOSED),
          backgroundColor: "#0f172a", 
          borderRight: "none",
          color: "#cbd5e1",
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          display: "flex",
          flexDirection: "column"
        }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: (open || isMobile) ? "space-between" : "center", minHeight: 70 }}>
        {(open || isMobile) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ bgcolor: theme.palette.primary.main, p: 0.8, borderRadius: "10px", display: 'flex' }}>
              <StoreIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#fff", lineHeight: 1 }}>
              VENTAS<span style={{ color: theme.palette.primary.main, display: 'block', fontSize: '10px', opacity: 0.8 }}>GESTIÓN COMERCIAL</span>
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={onToggle} sx={{ color: "inherit", bgcolor: alpha("#fff", 0.05) }}>
            <ChevronLeftIcon sx={{ transform: !open ? "rotate(180deg)" : "none" }} />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: alpha("#fff", 0.05), mx: 2 }} />

      {/* Menú */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        {menuGroups.map((group, index) => (
          <Box key={group.title} sx={{ mb: 2 }}>
            {(open || isMobile) && (
              <Typography variant="caption" sx={{ px: 4, fontWeight: 700, color: alpha("#fff", 0.3), textTransform: 'uppercase', letterSpacing: 1.2 }}>
                {group.title}
              </Typography>
            )}
            <List sx={{ mt: 1 }}>
              {group.items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <ListItemButton 
                    key={item.text}
                    selected={active}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      margin: "4px 14px",
                      borderRadius: "12px",
                      padding: "12px",
                      justifyContent: open ? "initial" : "center",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                        "& .MuiListItemIcon-root": { color: "#fff" },
                      },
                      "&:hover": { backgroundColor: active ? theme.palette.primary.main : alpha("#fff", 0.05) },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: (open || isMobile) ? 2 : "auto", color: active ? "#fff" : alpha("#cbd5e1", 0.7), justifyContent: "center" }}>
                      {item.icon}
                    </ListItemIcon>
                    {(open || isMobile) && (
                      <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: active ? 700 : 500 }} />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
            {index === 0 && <Divider sx={{ borderColor: alpha("#fff", 0.05), my: 1, mx: 2 }} />}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      {(open || isMobile) && (
        <Box sx={{ p: 3, textAlign: 'center', mt: 'auto' }}>
          <Typography variant="caption" sx={{ color: alpha("#fff", 0.2), fontWeight: 600 }}>
             MODO CAJERO ACTIVO
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}