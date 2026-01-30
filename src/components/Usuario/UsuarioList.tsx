import { useState, useEffect } from "react";
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Avatar, IconButton, 
   TextField, InputAdornment, Button, Pagination, Chip, 
  CircularProgress, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Divider 
} from "@mui/material";
import { 
  Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon,
  Edit as EditIcon, ArrowBack as ArrowBackIcon, WarningAmber as WarningIcon,
  People as PeopleIcon
} from "@mui/icons-material";

import { listUsuarios, deleteUsuario } from "../../services/usuarioService";
import type { Usuario } from "../../types/usuario.type";
import UsuarioForm from "./UsuarioForm"; 

export default function UsuarioList() {
  const [view, setView] = useState<"list" | "form">("list");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{id: string, nombre: string} | null>(null);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await listUsuarios(page, 10, filter);
      setUsuarios(res.docs || []);
      setTotalPages(Math.ceil(res.totalDocs / 10) || 1);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (view === "list") cargarUsuarios();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, filter, view]);

  const handleEdit = (user: Usuario) => {
    setSelectedUser(user);
    setView("form");
  };

  const handleOpenDelete = (id: string, nombre: string) => {
    setUserToDelete({ id, nombre });
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUsuario(userToDelete.id);
        setOpenConfirm(false);
        cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  if (view === "form") {
    return (
      <Box sx={{ p: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => setView("list")}
          sx={{ mb: 3, fontWeight: 700, color: '#64748b', textTransform: 'none' }}
        >
          Volver a la Lista
        </Button>
        <UsuarioForm 
          usuarioEdit={selectedUser} 
          onSuccess={() => {
            setView("list");
            cargarUsuarios();
          }} 
          onCancel={() => setView("list")}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#eef2ff', color: '#4f69f9' }}><PeopleIcon /></Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Gestión de Usuarios</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => { setSelectedUser(null); setView("form"); }}
              sx={{ bgcolor: '#4f69f9', borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Nuevo Usuario
            </Button>
          </Box>
          <TextField
            fullWidth
            placeholder="Buscar por correo..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
            }}
            sx={{ bgcolor: '#f8fafc', borderRadius: 3, '& fieldset': { border: 'none' } }}
          />
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>USUARIO</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>CORREO</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>EMPLEADO ASIGNADO</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5 }}><CircularProgress /></TableCell></TableRow>
              ) : (
                usuarios.map((user) => (
                  <TableRow key={user.id_usuario} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#eef2ff', color: '#4f69f9', fontWeight: 700 }}>
                          {(user.nombre || "U").charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {user.nombre}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{user.email}</TableCell>
                    <TableCell>
                       <Chip 
                         label={user.empleado?.nombre || 'Sin asignar'} 
                         size="small" 
                         variant="outlined" 
                         sx={{ fontWeight: 600, color: '#4f69f9', borderColor: '#e0e7ff' }}
                       />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(user)} sx={{ color: '#4f69f9' }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton onClick={() => handleOpenDelete(user.id_usuario, user.nombre)} sx={{ color: '#ef4444' }}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" shape="rounded" />
        </Box>
      </Paper>

      {/* DIÁLOGO DE CONFIRMACIÓN */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800 }}>
          <WarningIcon sx={{ color: '#ef4444' }} /> ¿Eliminar usuario?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de eliminar a <strong>{userToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancelar</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: '#ef4444', borderRadius: 2, fontWeight: 700 }}>
            Eliminar Usuario
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}