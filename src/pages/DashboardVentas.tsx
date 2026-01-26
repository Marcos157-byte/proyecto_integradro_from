import { Box, Toolbar } from "@mui/material";
import SidebarVentas from "../components/layout/SidebarVenta";
import TopBar from "../components/layout/TopBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function DashboardVentas() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar onMenuClick={() => setOpenSidebar(true)} />
      <SidebarVentas open={openSidebar} onClose={() => setOpenSidebar(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}