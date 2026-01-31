import { useState, useEffect } from "react";
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Avatar, IconButton, 
  TextField, InputAdornment, Button, Pagination, Chip, 
  CircularProgress, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Stack
} from "@mui/material";
import { 
  DeleteForeverRounded as DeleteIcon, 
  SearchRounded as SearchIcon, 
  PersonAddRounded as AddIcon,
  ModeEditOutlineRounded as EditIcon, 
  ArrowBackIosNewRounded as ArrowBackIcon, 
  ReportProblemRounded as WarningIcon,
  BadgeRounded as BadgeIcon,
  AlternateEmailRounded as EmailIcon,
  SecurityRounded as AdminIcon
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
      <Box sx={{ p: 4, bgcolor: '#fafafa', minHeight: '100vh' }}>
        <Button 
          startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />} 
          onClick={() => setView("list")}
          sx={{ mb: 3, fontWeight: 900, color: '#000', fontFamily: 'monospace' }}
        >
          VOLVER_AL_DIRECTORIO
        </Button>
        <UsuarioForm 
          usuarioEdit={selectedUser} 
          onSuccess={() => { setView("list"); cargarUsuarios(); }} 
          onCancel={() => setView("list")}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#fafafa', minHeight: '100vh' }}>
      
      {/* HEADER INDUSTRIAL */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '4px solid #000', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminIcon sx={{ fontSize: 45, color: '#000' }} />
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '2rem', lineHeight: 1 }}>CONTROL_DE_<span style={{color: '#3a7afe'}}>ACCESO</span></Typography>
            <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'text.secondary' }}>AUTH_SERVICE // USER_DATABASE</Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => { setSelectedUser(null); setView("form"); }}
          sx={{ bgcolor: '#000', borderRadius: 0, fontWeight: 900, px: 3, py: 1.5, '&:hover': { bgcolor: '#333' } }}
        >
          ALTA_DE_USUARIO
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 0, border: '4px solid #000', boxShadow: '12px 12px 0px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* BARRA DE BÚSQUEDA TÉCNICA */}
        <Box sx={{ p: 2, bgcolor: '#f1f5f9' }}>
          <TextField
            fullWidth
            placeholder="FILTRAR_POR_EMAIL_O_NOMBRE..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#000' }} /></InputAdornment>,
              sx: { bgcolor: '#fff', borderRadius: 0, fontWeight: 700, border: '2px solid #000' }
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#000' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, color: '#fff', letterSpacing: 1 }}>IDENTIDAD_USUARIO</TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#fff', letterSpacing: 1 }}>CREDENCIAL_EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 900, color: '#fff', letterSpacing: 1 }}>VÍNCULO_EMPLEADO</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900, color: '#fff', letterSpacing: 1 }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><CircularProgress color="inherit" thickness={6} /></TableCell></TableRow>
              ) : (
                usuarios.map((user) => (
                  <TableRow key={user.id_usuario} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ 
                          bgcolor: '#000', 
                          color: '#fff', 
                          fontWeight: 900, 
                          borderRadius: 0,
                          border: '2px solid #3a7afe'
                        }}>
                          {(user.nombre || "U").charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography sx={{ fontWeight: 900, color: '#1e293b', fontSize: '1rem' }}>
                          {user.nombre.toUpperCase()}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon sx={{ fontSize: 16, color: '#64748b' }} />
                        <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#64748b' }}>
                          {user.email}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                       <Chip 
                         icon={<BadgeIcon sx={{ fontSize: '14px !important' }} />}
                         label={user.empleado?.nombre.toUpperCase() || 'NO_VINCULADO'} 
                         sx={{ 
                            borderRadius: 0, 
                            fontWeight: 800, 
                            bgcolor: user.empleado ? '#eef2ff' : '#fff1f2',
                            color: user.empleado ? '#4f69f9' : '#e11d48',
                            border: '1px solid currentColor',
                            fontFamily: 'monospace'
                         }}
                       />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(user)} sx={{ border: '2px solid #000', borderRadius: 0, mr: 1, '&:hover': { bgcolor: '#000', color: '#fff' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDelete(user.id_usuario, user.nombre)} sx={{ border: '2px solid #000', borderRadius: 0, '&:hover': { bgcolor: '#ef4444', color: '#fff', borderColor: '#ef4444' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '2px solid #000', display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, v) => setPage(v)} 
            shape="rounded" 
            renderItem={(item) => (
              <Box component="span" sx={{ '& .Mui-selected': { bgcolor: '#000 !important', color: '#fff', fontWeight: 900 } }}>
                {/* El renderItem se encarga de aplicar los estilos a los botones de paginación */}
                <Button {...(item as any)} sx={{ borderRadius: 0, fontWeight: 700, minWidth: 40 }} />
              </Box>
            )}
          />
        </Box>
      </Paper>

      {/* DIÁLOGO DE CONFIRMACIÓN BRUTALISTA */}
      <Dialog 
        open={openConfirm} 
        onClose={() => setOpenConfirm(false)} 
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 900, bgcolor: '#ef4444', color: '#fff' }}>
          <WarningIcon /> ELIMINAR_REGISTRO_CRÍTICO
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ color: '#000', fontWeight: 700 }}>
            ¿ESTÁ SEGURO DE REVOCAR EL ACCESO A: <span style={{ color: '#ef4444' }}>{userToDelete?.nombre.toUpperCase()}</span>? 
            ESTA ACCIÓN ES IRREVERSIBLE.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ fontWeight: 900, color: '#000' }}>CANCELAR</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ bgcolor: '#ef4444', borderRadius: 0, fontWeight: 900, px: 3 }}>
            CONFIRMAR_BAJA
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}