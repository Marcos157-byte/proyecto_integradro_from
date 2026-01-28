import { Box, Toolbar, styled } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import SidebarBodega from "../components/layout/SidebarBodega";

// ✅ Definimos el ancho del sidebar para los cálculos de UX
const DRAWER_WIDTH = 260;

// ✅ Patrón de Diseño: Main estilizado que empuja el contenido
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  minHeight: "100vh",
  padding: theme.spacing(3),
  backgroundColor: "#F4F7FE", // Color de fondo profesional (Soft Blue)
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // ✅ CORRECCIÓN: Si el menú está abierto en Desktop, añade margen izquierdo
  marginLeft: 0,
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? `${DRAWER_WIDTH}px` : `88px`, // 88px es el ancho del sidebar colapsado
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Centra el contenido horizontalmente
}));

export default function DashboardBodega() {
  const [openSidebar, setOpenSidebar] = useState(true);

  const handleToggle = () => setOpenSidebar(!openSidebar);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Barra superior con evento para abrir/cerrar */}
      <TopBar onMenuClick={handleToggle} />
      
      {/* Sidebar de Bodega configurado con estado dinámico */}
      <SidebarBodega open={openSidebar} onToggle={handleToggle} />
      
      {/* Contenedor principal con margen dinámico para evitar solapamiento */}
      <Main open={openSidebar}>
        {/* Toolbar funciona como espaciador vertical para que el TopBar no tape el contenido */}
        <Toolbar /> 
        
        {/* Contenedor con ancho máximo para un aspecto limpio y centrado */}
        <Box 
          sx={{ 
            width: "100%", 
            maxWidth: "1400px", // Evita que en pantallas ultra-anchas se pierda el foco
            mt: 2 
          }}
        >
          <Outlet /> 
        </Box>
      </Main>
    </Box>
  );
}