import { Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import SidebarBodega from "../components/layout/SidebarBodega";



export default function DashboardBodega() {
  const [openSidebar, setOpenSidebar] = useState(true);

  // Esta función es la que pasamos al Sidebar
  const handleToggle = () => setOpenSidebar(!openSidebar);

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar onMenuClick={handleToggle} />
      
      {/* IMPORTANTE: Aquí pasamos 'handleToggle' a la prop 'onToggle' 
         que tu Sidebar ya usa internamente para cerrar el menú 
      */}
      <SidebarBodega open={openSidebar} onToggle={handleToggle} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> 
        {/* Sin esto, el navigate del sidebar cambia la URL pero no el dibujo */}
        <Outlet /> 
      </Box>
    </Box>
  );
}