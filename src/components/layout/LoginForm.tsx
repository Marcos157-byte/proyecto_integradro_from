import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Avatar, 
  Alert, 
  InputAdornment, 
  IconButton 
} from "@mui/material";
import { 
  LockOutlined as LockIcon, 
  EmailOutlined as EmailIcon, 
  Visibility, 
  VisibilityOff} from "@mui/icons-material";


interface LoginFormProps {
  onSuccess: (rol: string) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
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
        setError("Credenciales inválidas ❌");
      } else {
        onSuccess(user.rol.toLowerCase());
      }
    } catch (err) {
      setError("Error al conectar con el servidor 📡");
    } finally {
      setLoading(false);
    }
  };

  // Estilo para limpiar el fondo plomo del autocompletado de Chrome
  const autocompleteStyle = {
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px white inset !important",
      WebkitTextFillColor: "#1e293b !important",
    },
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        width: "100vw", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #3a7afe 0%, #1e40af 100%)",
        position: "fixed", 
        top: 0,
        left: 0
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={24} 
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            borderRadius: 6, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            bgcolor: "#ffffff", // Fondo blanco sólido para asegurar limpieza
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center", mb: 2 }}>
            <Box 
              component="img" 
               
              alt="Logo" 
              sx={{ maxWidth: "180px", height: "auto" }} 
            />
          </Box>

          <Avatar sx={{ mb: 1, bgcolor: "#3a7afe", width: 56, height: 56 }}>
            <LockIcon fontSize="large" />
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
            Bienvenido
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo Electrónico"
              autoComplete="off" // Desactiva sugerencias nativas
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              // Aplicamos el fix del fondo aquí
              sx={{ 
                ...autocompleteStyle,
                "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "transparent" } 
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password" // Evita el fondo plomo de guardado
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                ...autocompleteStyle,
                "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "transparent" } 
              }}
            />

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 4, 
                py: 1.8, 
                borderRadius: 3, 
                fontWeight: 800,
                textTransform: "none",
                background: "linear-gradient(45deg, #3a7afe 30%, #4f46e5 90%)",
              }}
            >
              {loading ? "Cargando..." : "Ingresar al Sistema"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  ); 
}