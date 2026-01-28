import { Box, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import SidebarVentas from "../components/layout/SidebarVenta";
import React from "react";


const DRAWER_WIDTH = 260;

const MainContent = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  minHeight: "100vh",
  backgroundColor: "#F4F7FE",
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // ✅ ESTO CORRIGE EL CONTENIDO TAPADO:
  marginLeft: 0,
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? `${DRAWER_WIDTH}px` : `88px`, 
  },
}));

export default function VentasLayout() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar onMenuClick={() => setOpen(!open)} />
      <SidebarVentas open={open} onToggle={() => setOpen(!open)} />
      <MainContent open={open}>
        {/* Espaciador para que el TopBar no tape el inicio del contenido */}
        <Box sx={{ height: "80px" }} /> 
        <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Outlet />
        </Box>
      </MainContent>
    </Box>
  );
}