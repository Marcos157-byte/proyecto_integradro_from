import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert, 
  InputAdornment, 
  IconButton,
  Stack
} from "@mui/material";
import { 
  LockOutlined as LockIcon, 
  EmailOutlined as EmailIcon, 
  Visibility, 
  VisibilityOff,
  ArrowBackIosNew
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// --- FIX PARA EL FONDO GRIS DEL AUTOCOMPLETADO ---
const autofillFix = {
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #fff inset !important", // Obliga a que sea blanco
    WebkitTextFillColor: "#000 !important", // Obliga a que el texto sea negro
    transition: "background-color 5000s ease-in-out 0s",
  },
};

const MotionPaper = motion.create(Paper);

interface LoginFormProps {
  onSuccess: (rol: string) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (!user) {
        setError("CREDENCIALES INVÁLIDAS");
      } else {
        onSuccess(user.rol.toLowerCase());
      }
    } catch (err) {
      setError("ERROR DE CONEXIÓN CON EL SERVIDOR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        width: "100vw", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        bgcolor: "#000", // Fondo negro como el Index
        position: "fixed", 
        top: 0,
        left: 0,
        color: "#fff"
      }}
    >
      {/* BOTÓN VOLVER */}
      <Button
        startIcon={<ArrowBackIosNew sx={{ fontSize: 12 }} />}
        onClick={() => navigate("/")}
        sx={{ 
          position: "absolute", 
          top: 40, 
          left: 40, 
          color: "#fff", 
          fontWeight: 800, 
          fontSize: "0.7rem",
          letterSpacing: 2,
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
        }}
      >
        VOLVER AL LAB
      </Button>

      <Container maxWidth="xs">
        <MotionPaper 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          elevation={0} 
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            borderRadius: 0, // Estilo recto Denim Lab
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            bgcolor: "#fff", 
            border: "1px solid #333",
          }}
        >
          {/* LOGOTIPO */}
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 900, letterSpacing: "-3px", color: "#000", mb: 1 }}
          >
            DENIM_LAB.
          </Typography>

          <Typography 
            variant="overline" 
            sx={{ fontWeight: 700, letterSpacing: 4, color: "#888", mb: 4 }}
          >
            ACCESS_SYSTEM
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                label="ID_USUARIO / EMAIL"
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#000", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  ...autofillFix,
                  "& .MuiInputLabel-root": { color: "#888", fontWeight: 700, fontSize: "0.7rem" },
                  "& .MuiInput-underline:before": { borderBottomColor: "#eee" },
                  "& .MuiInput-underline:after": { borderBottomColor: "#000" }
                }}
              />
              
              <TextField
                required
                fullWidth
                label="CONTRASEÑA"
                type={showPassword ? "text" : "password"}
                variant="standard"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#000", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  ...autofillFix,
                  "& .MuiInputLabel-root": { color: "#888", fontWeight: 700, fontSize: "0.7rem" },
                  "& .MuiInput-underline:before": { borderBottomColor: "#eee" },
                  "& .MuiInput-underline:after": { borderBottomColor: "#000" }
                }}
              />
            </Stack>

            {error && (
              <Alert 
                severity="error" 
                variant="filled"
                sx={{ mt: 3, borderRadius: 0, fontWeight: 900, fontSize: "0.6rem", bgcolor: "#000" }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 6, 
                py: 2, 
                borderRadius: 0,
                fontWeight: 900,
                letterSpacing: 2,
                textTransform: "uppercase",
                bgcolor: "#000",
                color: "#fff",
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: "#333", transform: "translateY(-2px)" },
                "&.Mui-disabled": { bgcolor: "#eee", color: "#aaa" }
              }}
            >
              {loading ? "VERIFICANDO..." : "INGRESAR AL SISTEMA"}
            </Button>

            <Typography 
              variant="caption" 
              sx={{ display: "block", textAlign: "center", mt: 4, color: "#ccc", fontWeight: 700, fontSize: "0.6rem" }}
            >
              © 2026 DENIM_LAB INTERFACE
            </Typography>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  ); 
}