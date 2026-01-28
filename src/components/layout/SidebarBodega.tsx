import React, { useMemo } from "react";
import {
  Drawer, List, ListItemIcon, ListItemText, ListItemButton,
  Box, Typography, Divider, alpha, useTheme, useMediaQuery, IconButton
} from "@mui/material";
import {
  DashboardRounded as DashboardIcon,
  InventoryRounded as InventoryIcon,
  CategoryRounded as CategoryIcon,
  StraightenRounded as StraightenIcon,
  PaletteRounded as PaletteIcon,
  LocalShippingRounded as LocalShippingIcon,
  ChevronLeftRounded as ChevronLeftIcon,
  WarehouseRounded as WarehouseIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_CLOSED = 88;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function SidebarBodega({ open, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estructura de menú vinculada a las rutas de App.tsx
  const menuGroups = useMemo(() => [
    {
      title: "Logística",
      items: [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/bodega" }, 
        { text: "Productos", icon: <InventoryIcon />, path: "/bodega/productos" },
        { text: "Proveedores", icon: <LocalShippingIcon />, path: "/bodega/proveedores" },
      ]
    },
    {
      title: "Personalización",
      items: [
        { text: "Categorías", icon: <CategoryIcon />, path: "/bodega/categorias" },
        { text: "Tallas", icon: <StraightenIcon />, path: "/bodega/tallas" },
        { text: "Colores", icon: <PaletteIcon />, path: "/bodega/colores" },
      ]
    }
  ], []);

  const handleNavigation = (path: string) => {
    navigate(path);
    // IMPORTANTE: Si es móvil, cerramos el drawer automáticamente tras navegar
    if (isMobile) onToggle();
  };

  return (
    <Drawer 
      variant={isMobile ? "temporary" : "permanent"} 
      open={open} 
      onClose={onToggle}
      ModalProps={{ keepMounted: true }} 
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
          boxShadow: isMobile ? "10px 0 25px rgba(0,0,0,0.5)" : "none"
        }
      }}
    >
      {/* Cabecera */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: (open || isMobile) ? "space-between" : "center", minHeight: 64 }}>
        {(open || isMobile) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarehouseIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: "#fff", letterSpacing: 1 }}>
              BODEGA<span style={{ color: theme.palette.primary.main }}>PRO</span>
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={onToggle} sx={{ color: "inherit" }}>
            <ChevronLeftIcon sx={{ transform: !open ? "rotate(180deg)" : "none", transition: '0.3s' }} />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: alpha("#fff", 0.05) }} />

      {/* Menú Dinámico */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        {menuGroups.map((group) => (
          <React.Fragment key={group.title}>
            {open && (
              <Typography 
                variant="caption" 
                sx={{ px: 4, py: 1.5, display: 'block', color: alpha("#cbd5e1", 0.4), fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}
              >
                {group.title}
              </Typography>
            )}
            
            <List sx={{ px: 1.5 }}>
              {group.items.map((item) => {
                // Comprobación de ruta activa
                const isSelected = location.pathname === item.path;
                
                return (
                  <ListItemButton 
                    key={item.text}
                    selected={isSelected}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      margin: "4px 0",
                      borderRadius: "12px",
                      padding: "10px 16px",
                      justifyContent: open ? "initial" : "center",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                        "& .MuiListItemIcon-root": { color: "#fff" },
                        "&:hover": { backgroundColor: theme.palette.primary.dark },
                      },
                      "&:hover": { 
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          transform: open ? "translateX(6px)" : "none"
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 0, 
                      mr: open ? 2 : "auto", 
                      color: isSelected ? "#fff" : alpha("#cbd5e1", 0.6), 
                      justifyContent: "center" 
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          fontSize: '0.875rem', 
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "#fff" : "inherit"
                        }} 
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
            <Box sx={{ mb: 1.5 }} />
          </React.Fragment>
        ))}
      </Box>

      {/* Footer */}
      {(open || isMobile) && (
        <Box sx={{ p: 2, textAlign: 'center', borderTop: `1px solid ${alpha("#fff", 0.05)}` }}>
          <Typography variant="caption" sx={{ color: alpha("#cbd5e1", 0.3), fontWeight: 500 }}>
            Sistema Gestión v2.6
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}