import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  alpha,
  styled,
  useTheme,
  Stack,
  Divider,
  useMediaQuery,
  ButtonBase
} from "@mui/material";
import {
  Menu as MenuIcon,
  KeyboardArrowDownRounded,
} from "@mui/icons-material"; 
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// --- Estilo Minimalista para el Botón de Perfil ---
const ProfilePill = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '4px 12px 4px 6px',
  borderRadius: 0, 
  gap: theme.spacing(1),
  transition: "all 0.2s ease-in-out",
  border: `1px solid transparent`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  },
}));

interface TopBarProps {
  onMenuClick: () => void;
  isSidebarOpen?: boolean;
}

export default function TopBar({ onMenuClick, isSidebarOpen }: TopBarProps) {
  const theme = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#000",
        borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
        zIndex: theme.zIndex.drawer + 1,
        width: "100%",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 2, md: 4 }, justifyContent: "space-between" }}>
        
        {/* IZQUIERDA: Menú y Logo */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton 
            onClick={onMenuClick}
            sx={{ 
              color: "white",
              borderRadius: 0,
              border: `1px solid ${alpha("#fff", 0.1)}`,
              "&:hover": { bgcolor: alpha("#fff", 0.1) }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {(!isSmall && !isSidebarOpen) && (
            <Typography 
                variant="h6" 
                sx={{ 
                    fontWeight: 900, 
                    letterSpacing: -1.5, 
                    ml: 1, 
                    fontSize: '1.4rem'
                }}
            >
              DENIM<span style={{ fontWeight: 200, color: '#888' }}>_LAB.</span>
            </Typography>
          )}
        </Stack>

        {/* DERECHA: Perfil de Usuario */}
        <Stack direction="row" alignItems="center">
          <ProfilePill onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}>
            <Avatar 
              sx={{ 
                width: 32, height: 32, 
                borderRadius: 0, 
                bgcolor: "#fff",
                color: "#000",
                fontSize: "0.8rem",
                fontWeight: 900
              }} 
            >
              {user?.nombre?.charAt(0).toUpperCase() || "A"}
            </Avatar>
            {!isMobile && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "white", letterSpacing: 1 }}>
                  {user?.nombre?.toUpperCase() || "USUARIO"}
                </Typography>
                <KeyboardArrowDownRounded 
                  sx={{ 
                    fontSize: 14, 
                    color: alpha("#fff", 0.4),
                    transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'none',
                    transition: '0.3s ease'
                  }} 
                />
              </Stack>
            )}
          </ProfilePill>
        </Stack>

        {/* Menú Desplegable - LIMPIO (Solo Info y Salir) */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          disableScrollLock
          elevation={0}
          sx={{ 
            "& .MuiPaper-root": { 
                mt: 1.5, 
                minWidth: 180, 
                borderRadius: 0, 
                p: 0,
                bgcolor: "#111", 
                color: "#fff",
                border: "1px solid #333",
            } 
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 2.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, color: "#fff", display: 'block', letterSpacing: 1 }}>
                {user?.nombre?.toUpperCase()}
            </Typography>
            <Typography variant="caption" sx={{ color: "#666", letterSpacing: 1, fontWeight: 700, fontSize: '0.6rem' }}>
              {user?.rol?.toUpperCase()}
            </Typography>
          </Box>
          
          <Divider sx={{ bgcolor: "#222" }} />
          
          <MenuItem 
            onClick={handleLogout} 
            sx={{ 
                py: 2, 
                bgcolor: "#fff", 
                color: "#000", 
                "&:hover": { bgcolor: "#ccc" }, 
                fontSize: '0.75rem', 
                fontWeight: 900, 
                justifyContent: 'center',
                letterSpacing: 2
            }}
          >
            SALIR
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}