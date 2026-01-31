import { useMemo } from "react";
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
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_CLOSED = 70;

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
      title: "PUNTO_DE_VENTA",
      items: [
        { text: "NUEVA VENTA", icon: <PointOfSaleIcon />, path: "/ventas/nueva" },
        { text: "HISTORIAL", icon: <ListAltIcon />, path: "/ventas/lista" },
        { text: "CAJA", icon: <CashIcon />, path: "/ventas/caja" },
      ]
    },                                                                                                                                                                                                                                  
    {
      title: "CATÁLOGOS",
      items: [
        { text: "CLIENTES", icon: <PeopleIcon />, path: "/ventas/cliente" },
        { text: "STOCK", icon: <InventoryIcon />, path: "/ventas/inventario" },
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
          backgroundColor: "#000",
          borderRight: `1px solid ${alpha("#fff", 0.1)}`,
          color: "#fff",
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
          <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: 1, color: "#fff" }}>
            VENTAS<span style={{ color: "#666", marginLeft: '4px' }}>_SYS</span>
          </Typography>
        )}
        {!isMobile && (
          <IconButton 
            onClick={onToggle} 
            sx={{ color: "white", borderRadius: 0, border: `1px solid ${alpha("#fff", 0.1)}`, p: 0.5 }}
          >
            <ChevronLeftIcon sx={{ transform: !open ? "rotate(180deg)" : "none", fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: alpha("#fff", 0.1) }} />

      {/* Cuerpo del Menú - ERROR DE INDEX CORREGIDO AQUÍ */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        {menuGroups.map((group) => ( // Eliminamos 'index' para evitar el warning de variable no usada
          <Box key={group.title} sx={{ mb: 3 }}>
            {(open || isMobile) && (
              <Typography variant="caption" sx={{ px: 3, fontWeight: 900, color: "#444", textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.65rem' }}>
                {group.title}
              </Typography>
            )}
            <List sx={{ mt: 1, px: 0 }}>
              {group.items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <ListItemButton 
                    key={item.text}
                    selected={active}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      py: 1.5,
                      px: open || isMobile ? 3 : 0,
                      justifyContent: open || isMobile ? "initial" : "center",
                      borderRadius: 0, 
                      borderLeft: active ? "4px solid #fff" : "4px solid transparent",
                      bgcolor: active ? alpha("#fff", 0.05) : "transparent",
                      "&.Mui-selected": {
                        bgcolor: alpha("#fff", 0.08),
                        "& .MuiListItemIcon-root": { color: "#fff" },
                        "&:hover": { bgcolor: alpha("#fff", 0.12) }
                      },
                      "&:hover": { bgcolor: alpha("#fff", 0.05) },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 0, 
                      mr: (open || isMobile) ? 2 : 0, 
                      color: active ? "#fff" : "#555",
                      justifyContent: "center" 
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {(open || isMobile) && (
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{ 
                          fontSize: "0.75rem", 
                          fontWeight: 800,
                          letterSpacing: 1,
                          color: active ? "#fff" : "#888"
                        }} 
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      {(open || isMobile) && (
        <Box sx={{ p: 2, borderTop: `1px solid ${alpha("#fff", 0.05)}` }}>
          <Box sx={{ bgcolor: "#111", p: 1.5, textAlign: 'center', border: "1px solid #222" }}>
            <Typography variant="caption" sx={{ color: "#fff", fontWeight: 900, fontSize: '0.6rem', letterSpacing: 1 }}>
              DENIM_LAB INTERFACE
            </Typography>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}