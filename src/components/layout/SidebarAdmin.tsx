import React, { useMemo } from "react";
import {
  Drawer, List, ListItemIcon, ListItemText, ListItemButton,
  Box, Typography, Divider, alpha, 
  useTheme, useMediaQuery, IconButton
} from "@mui/material";
import {
  DashboardRounded as DashboardIcon, 
  PeopleRounded as PeopleIcon,
  BadgeRounded as BadgeIcon, // 👈 ¡IMPORTANTE! Agregué esta importación
  ShoppingCartRounded as ShoppingCartIcon, 
  AssessmentRounded as AssessmentIcon,
  ChevronLeftRounded as ChevronLeftIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_CLOSED = 88;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function SidebarAdmin({ open, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuGroups = useMemo(() => [
    {
      title: "Principal",
      items: [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
        { text: "Usuarios", icon: <PeopleIcon />, path: "/admin/usuarios" },
        { text: "Empleados", icon: <BadgeIcon />, path: "/admin/empleados" }, // 👈 Agregado con su icono
      ]
    },
    {
      title: "Gestión",
      items: [
        { text: "Ventas", icon: <ShoppingCartIcon />, path: "/admin/ventas" },
        { text: "Reportes", icon: <AssessmentIcon />, path: "/admin/reportes" },
      ]
    }
  ], []); // Las dependencias están bien vacías porque los items son estáticos

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
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
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#fff" }}>
            PROMAX<span style={{ color: theme.palette.primary.main }}>DASH</span>
          </Typography>
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
            {/* Opcional: Podrías mostrar el título del grupo si el menú está abierto */}
            {open && (
               <Typography variant="caption" sx={{ px: 3, py: 1, display: 'block', opacity: 0.4, fontWeight: 700, textTransform: 'uppercase' }}>
                 {group.title}
               </Typography>
            )}
            <List>
              {group.items.map((item) => (
                <ListItemButton 
                  key={item.text}
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    margin: "4px 14px",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    justifyContent: open ? "initial" : "center",
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      "& .MuiListItemIcon-root": { color: "#fff" },
                    },
                    "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", color: "inherit", justifyContent: "center" }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />}
                </ListItemButton>
              ))}
            </List>
          </React.Fragment>
        ))}
      </Box>
    </Drawer>
  );
}