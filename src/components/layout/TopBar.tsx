import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  alpha,
  styled,
  useTheme,
  Stack,
  Divider,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
  ButtonBase,
  useScrollTrigger
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  MailOutlineRounded as MailIcon,
  NotificationsNoneRounded as NotificationsIcon,
  LogoutRounded,
  PersonOutlineRounded,
  SettingsOutlined,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// --- Estilos Mejorados ---

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  transition: theme.transitions.create(["all"], { duration: 300 }),
  width: "100%",
  maxWidth: 320,
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  "&:focus-within": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
    maxWidth: 400,
    boxShadow: `0 0 0 4px ${alpha(theme.palette.common.white, 0.05)}`,
  },
  // Ocultamos el buscador en móviles muy pequeños para evitar amontonamiento
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

const ProfilePill = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '4px 8px 4px 4px',
  borderRadius: 40,
  gap: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
}));

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const theme = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={trigger ? 4 : 0}
      sx={{
        backgroundColor: trigger ? "#1e40af" : "#3a7afe", 
        transition: "all 0.3s ease",
        zIndex: theme.zIndex.drawer + 1,
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 1.5, md: 3 } }}>
        
        {/* Sección Izquierda */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton 
            onClick={onMenuClick}
            sx={{ 
              color: "white",
              bgcolor: alpha("#fff", 0.1),
              borderRadius: "10px",
              "&:hover": { bgcolor: alpha("#fff", 0.2) }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {!isSmall && (
            <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: -0.5, ml: 1 }}>
              PROMAX<span style={{ opacity: 0.6 }}>DASH</span>
            </Typography>
          )}
        </Stack>

        {/* Buscador Central */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
          <SearchContainer>
            <Box sx={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', pl: 2, color: alpha('#fff', 0.7) }}>
              <SearchIcon fontSize="small" />
            </Box>
            <InputBase
              placeholder="Buscar..."
              sx={{
                color: "white",
                width: "100%",
                "& .MuiInputBase-input": {
                  padding: theme.spacing(1, 1, 1, 5),
                  fontSize: "0.875rem",
                  "&::placeholder": { color: alpha("#fff", 0.7), opacity: 1 }
                },
              }}
            />
          </SearchContainer>
          {/* Icono de búsqueda solo para móviles */}
          {isSmall && (
             <IconButton sx={{ color: "white" }}><SearchIcon /></IconButton>
          )}
        </Box>

        {/* Sección Derecha */}
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, md: 1 }}>
          
          {/* Iconos de acción (ocultos en móvil para ahorrar espacio) */}
          {!isMobile && (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Mensajes">
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="error"><MailIcon /></Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notificaciones">
                <IconButton color="inherit">
                  <Badge badgeContent={17} color="error"><NotificationsIcon /></Badge>
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 2, borderColor: alpha('#fff', 0.2), display: { xs: "none", sm: "block" } }} />

          {/* Perfil */}
          <ProfilePill onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar 
              src={user?.avatarUrl} 
              sx={{ 
                width: 32, height: 32, 
                border: `2px solid ${alpha('#fff', 0.5)}` 
              }} 
            >
              {user?.nombre?.charAt(0) || "A"}
            </Avatar>
            {!isMobile && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1, color: "white" }}>
                  {user?.nombre || "Admin"}
                </Typography>
                <KeyboardArrowDownRounded 
                  sx={{ 
                    fontSize: 18, 
                    color: "white",
                    transform: anchorEl ? 'rotate(180deg)' : 'none',
                    transition: '0.2s'
                  }} 
                />
              </Stack>
            )}
          </ProfilePill>
        </Stack>

        {/* Menú de Usuario */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          disableScrollLock
          PaperProps={{
            elevation: 4,
            sx: { mt: 1.5, minWidth: 200, borderRadius: 2, p: 0.5 }
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.nombre || "Admin"}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {user?.email || "admin@promax.com"}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ mt: 0.5, borderRadius: 1 }}>
            <ListItemIcon><PersonOutlineRounded fontSize="small" /></ListItemIcon>
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ borderRadius: 1 }}>
            <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
            Ajustes
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ borderRadius: 1, color: 'error.main' }}>
            <ListItemIcon><LogoutRounded fontSize="small" color="error" /></ListItemIcon>
            Cerrar Sesión
          </MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  );
}