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
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

const ProfilePill = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '4px 12px 4px 6px', // Un poco más de aire
  borderRadius: 40,
  gap: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    borderColor: alpha(theme.palette.common.white, 0.3),
  },
}));

interface TopBarProps {
  onMenuClick: () => void;
  isSidebarOpen?: boolean; // Nueva prop opcional por si quieres ajustar el margen
}

export default function TopBar({ onMenuClick, isSidebarOpen }: TopBarProps) {
  const theme = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 10 });
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
        backgroundColor: trigger ? "#1e3a8a" : "#3a7afe", // Azul un poco más oscuro al scrollear
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: theme.zIndex.drawer + 1, // Siempre encima del Sidebar
        backdropFilter: trigger ? "blur(12px)" : "none",
        width: "100%",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 2, md: 4 } }}>
        
        {/* Sección Izquierda */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Tooltip title="Menú Principal">
            <IconButton 
              onClick={onMenuClick}
              sx={{ 
                color: "white",
                bgcolor: alpha("#fff", 0.1),
                borderRadius: "12px",
                transition: "0.2s",
                "&:hover": { 
                    bgcolor: alpha("#fff", 0.2),
                    transform: "scale(1.05)"
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          
          {/* Ocultamos el logo si el sidebar está abierto en pantallas pequeñas */}
          {(!isSmall && !isSidebarOpen) && (
            <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: -0.8, ml: 1, userSelect: 'none' }}>
              PROMAX<span style={{ opacity: 0.7, fontWeight: 400 }}>DASH</span>
            </Typography>
          )}
        </Stack>

        {/* Buscador Central */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
          {!isSmall && (
            <SearchContainer>
              <Box sx={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', pl: 2, color: alpha('#fff', 0.8) }}>
                <SearchIcon fontSize="small" />
              </Box>
              <InputBase
                placeholder="¿Qué producto buscas hoy?..."
                sx={{
                  color: "white",
                  width: "100%",
                  "& .MuiInputBase-input": {
                    padding: theme.spacing(1.2, 1, 1.2, 5),
                    fontSize: "0.85rem",
                    "&::placeholder": { color: alpha("#fff", 0.6), opacity: 1 }
                  },
                }}
              />
            </SearchContainer>
          )}
        </Box>

        {/* Sección Derecha */}
        <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 1.5 }}>
          
          {isSmall && (
            <IconButton sx={{ color: "white", bgcolor: alpha("#fff", 0.1) }}>
                <SearchIcon fontSize="small" />
            </IconButton>
          )}

          {!isMobile && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Mensajes">
                <IconButton color="inherit" sx={{ bgcolor: alpha("#fff", 0.05) }}>
                  <Badge badgeContent={4} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
                    <MailIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notificaciones">
                <IconButton color="inherit" sx={{ bgcolor: alpha("#fff", 0.05) }}>
                  <Badge badgeContent={17} color="error" sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}>
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Stack>
          )}

          <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ mx: 1, my: 2, borderColor: alpha('#fff', 0.15), display: { xs: "none", sm: "block" } }} 
          />

          {/* Perfil */}
          <ProfilePill onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar 
              src={user?.avatarUrl} 
              sx={{ 
                width: 34, height: 34, 
                boxShadow: `0 0 0 2px ${alpha('#fff', 0.2)}`,
                bgcolor: theme.palette.primary.dark
              }} 
            >
              {user?.nombre?.charAt(0) || "A"}
            </Avatar>
            {!isMobile && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white", letterSpacing: 0.2 }}>
                  {user?.nombre || "Administrador"}
                </Typography>
                <KeyboardArrowDownRounded 
                  sx={{ 
                    fontSize: 18, 
                    color: alpha("#fff", 0.7),
                    transform: anchorEl ? 'rotate(180deg)' : 'none',
                    transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} 
                />
              </Stack>
            )}
          </ProfilePill>
        </Stack>

        {/* Menú de Usuario (Igual al tuyo, con ajustes de padding) */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          disableScrollLock
          elevation={0}
          sx={{ 
            "& .MuiPaper-root": { 
                mt: 1.5, 
                minWidth: 220, 
                borderRadius: "16px", 
                p: 1,
                boxShadow: '0px 10px 25px rgba(0,0,0,0.1)',
                border: `1px solid ${theme.palette.divider}`
            } 
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5, mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{user?.nombre || "Admin"}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || "admin@promax.com"}
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ borderRadius: "10px", py: 1 }}>
            <ListItemIcon><PersonOutlineRounded fontSize="small" /></ListItemIcon>
            Mi Perfil
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ borderRadius: "10px", py: 1 }}>
            <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
            Configuración
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleLogout} sx={{ borderRadius: "10px", py: 1, color: 'error.main', fontWeight: 600 }}>
            <ListItemIcon><LogoutRounded fontSize="small" color="error" /></ListItemIcon>
            Cerrar Sesión
          </MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  );
}