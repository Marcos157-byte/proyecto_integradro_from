import  { useState, useEffect } from "react";
import { Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import TopBar from "../components/layout/TopBar";
import SidebarAdmin from "../components/layout/SidebarAdmin"; 
import { Outlet } from "react-router-dom";

// Definimos las constantes de ancho para que coincidan con tu Sidebar
const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_CLOSED = 88;

export default function DashboardAdmin() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estado inicial: abierto en PC, cerrado en Móvil
  const [openSidebar, setOpenSidebar] = useState(!isMobile);

  // Sincronizar el estado si el usuario cambia el tamaño de la ventana manualmente
  useEffect(() => {
    setOpenSidebar(!isMobile);
  }, [isMobile]);

  const handleToggle = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* 1. Barra Superior fija */}
      <TopBar onMenuClick={handleToggle} />

      {/* 2. Menú Lateral dinámico */}
      <SidebarAdmin 
        open={openSidebar} 
        onToggle={handleToggle} 
      />

      {/* 3. Contenido Principal con Margen Inteligente */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 },
          width: "100%",
          minHeight: "100vh",
          /* EXPLICACIÓN DEL MARGEN:
             - En móvil (isMobile): 0px porque el menú es flotante (temporary).
             - En PC: Si está abierto usa DRAWER_WIDTH, si está cerrado usa DRAWER_WIDTH_CLOSED.
          */
          ml: isMobile 
            ? 0 
            : `${openSidebar ? DRAWER_WIDTH : DRAWER_WIDTH_CLOSED}px`,
          
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Toolbar actúa como espaciador para que el contenido no quede bajo la barra azul */}
        <Toolbar /> 
        
        {/* Contenedor interno para asegurar que el contenido respete los límites */}
        <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}