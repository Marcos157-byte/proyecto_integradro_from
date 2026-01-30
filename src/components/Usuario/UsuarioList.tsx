import { useState, useEffect } from "react";
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Avatar, IconButton, 
  Tooltip, TextField, InputAdornment, Button, Pagination, Chip, 
  CircularProgress, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions 
} from "@mui/material";
import { 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  WarningAmber as WarningIcon
} from "@mui/icons-material";

import { listUsuarios, deleteUsuario } from "../../services/usuarioService";
import UsuarioForm from "./UsuarioForm"; 

export default function UsuarioList() {
  const [view, setView] = useState<"list" | "form">("list");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados para el Modal de Confirmación
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{id: string, nombre: string} | null>(null);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await listUsuarios(page, 10, filter);
      setUsuarios(res.docs);
      setTotalPages(Math.ceil(res.totalDocs / res.limit));
    } catch (error) {
      console.error("Error capturado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") cargarUsuarios();
  }, [page, filter, view]);

  // Manejadores de Eliminación
  const handleOpenDelete = (id: string, nombre: string) => {
    setUserToDelete({ id, nombre });
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUsuario(userToDelete.id);
      setOpenConfirm(false);
      setUserToDelete(null);
      cargarUsuarios();
    }
  };

  if (view === "form") {
    return (
      <Box sx={{ p: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => setView("list")}
          sx={{ mb: 3, fontWeight: 700, color: '#64748b' }}
        >
          Volver a la Lista
        </Button>
        <UsuarioForm onSuccess={() => setView("list")} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Gestión de Usuarios</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar usuario..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ bgcolor: 'white', borderRadius: 2, width: 280 }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setView("form")}
            sx={{ bgcolor: '#4f69f9', borderRadius: 2, fontWeight: 700 }}
          >
            Nuevo Usuario
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafd' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>USUARIO</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CORREO</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ROLES</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 8 }}><CircularProgress /></TableCell></TableRow>
            ) : (
              usuarios.map((user) => (
                <TableRow key={user.id_usuario} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#eef2ff', color: '#4f69f9' }}>{user.nombre.charAt(0)}</Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.nombre}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.rolUsuarios?.map((ru: any) => (
                      <Chip key={ru.rol.id_rol} label={ru.rol.rol} size="small" sx={{ mr: 0.5, bgcolor: '#dcfce7', color: '#166534' }} />
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Eliminar Usuario">
                      <IconButton color="error" onClick={() => handleOpenDelete(user.id_usuario, user.nombre)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      </TableContainer>

      {/* MODAL DE CONFIRMACIÓN */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" /> ¿Confirmar eliminación?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de eliminar al usuario <strong>{userToDelete?.nombre}</strong>. 
            Esta acción no se puede deshacer y el usuario perderá el acceso al sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ color: '#64748b' }}>Cancelar</Button>
          <Button onClick={confirmDelete} variant="contained" color="error" sx={{ borderRadius: 2 }}>
            Sí, Eliminar Usuario
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}