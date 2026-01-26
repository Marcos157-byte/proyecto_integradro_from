import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

type SidebarVentasProps = {
  open: boolean;
  onClose: () => void;
};

export default function SidebarVentas({ open, onClose }: SidebarVentasProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: theme.palette.custom.sidebar,
          color: "#fff",
        },
      }}
    >
      <List>
        {/* Registrar nueva venta */}
        <ListItemButton onClick={() => navigate("/ventas/nueva")}>
          <ListItemIcon>
            <PointOfSaleIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Nueva Venta" />
        </ListItemButton>

        {/* Lista de ventas */}
        <ListItemButton onClick={() => navigate("/ventas/lista")}>
          <ListItemIcon>
            <ListAltIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Lista de Ventas" />
        </ListItemButton>

        {/* Clientes */}
        <ListItemButton onClick={() => navigate("/ventas/clientes")}>
          <ListItemIcon>
            <PeopleIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Clientes" />
        </ListItemButton>

        {/* Reportes */}
        <ListItemButton onClick={() => navigate("/ventas/reportes")}>
          <ListItemIcon>
            <AssessmentIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Reportes" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

