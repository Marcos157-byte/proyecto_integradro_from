import React, { useMemo } from "react";
import {
  Drawer, List, ListItemIcon, ListItemText, ListItemButton,
  Box, Typography, Divider, alpha, useTheme, useMediaQuery, IconButton
} from "@mui/material";
import {
  DashboardRounded as DashboardIcon, // Importamos el icono de Dash
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

  const menuGroups = useMemo(() => [
    {
      title: "Logística",
      items: [
        // Agregamos el Dashboard como ruta principal de bodega
        { text: "Dashboard", icon: <DashboardIcon />, path: "/bodega" }, 
        { text: "Productos", icon: <InventoryIcon />, path: "/bodega/productos" },
        { text: "Proveedores", icon: <LocalShippingIcon />, path: "/bodega/proveedores" },
      ]
    },
    {
      title: "Atributos",
      items: [
        { text: "Categorías", icon: <CategoryIcon />, path: "/bodega/categorias" },
        { text: "Tallas", icon: <StraightenIcon />, path: "/bodega/tallas" },
        { text: "Colores", icon: <PaletteIcon />, path: "/bodega/colores" },
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
        }
      }}
    >
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: (open || isMobile) ? "space-between" : "center", minHeight: 64 }}>
        {(open || isMobile) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarehouseIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: "#fff" }}>
              BODEGA<span style={{ color: theme.palette.primary.main }}>PRO</span>
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={onToggle} sx={{ color: "inherit" }}>
            <ChevronLeftIcon sx={{ transform: !open ? "rotate(180deg)" : "none" }} />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: alpha("#fff", 0.05) }} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        {menuGroups.map((group) => (
          <React.Fragment key={group.title}>
            {open && (
              <Typography 
                variant="caption" 
                sx={{ px: 4, py: 1, display: 'block', color: alpha("#cbd5e1", 0.4), fontWeight: 700, textTransform: 'uppercase' }}
              >
                {group.title}
              </Typography>
            )}
            
            <List sx={{ px: 1.5 }}>
              {group.items.map((item) => (
                <ListItemButton 
                  key={item.text}
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    margin: "4px 0",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    justifyContent: open ? "initial" : "center",
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      "& .MuiListItemIcon-root": { color: "#fff" },
                    },
                    "&:hover": { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.08) 
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 0, 
                    mr: open ? 2 : "auto", 
                    color: "inherit", 
                    justifyContent: "center" 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: location.pathname === item.path ? 700 : 500 }} 
                    />
                  )}
                </ListItemButton>
              ))}
            </List>
            <Box sx={{ my: 1 }} />
          </React.Fragment>
        ))}
      </Box>
    </Drawer>
  );
}