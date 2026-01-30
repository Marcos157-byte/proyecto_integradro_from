import { useState, useEffect, useCallback } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, IconButton, Tooltip, 
  CircularProgress, TextField, InputAdornment, Button, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Avatar, Chip
} from '@mui/material';
import { 
  Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, 
  People as PeopleIcon, PersonAdd as PersonAddIcon, ArrowBack as ArrowBackIcon, 
  WarningAmber as WarningIcon 
} from '@mui/icons-material';

import { listClientes, deleteCliente } from '../../services/clienteService';
import type { Cliente } from '../../types/cliente.type';
import ClienteForm from './ClienteForm';

export default function ClienteList() {
  const [view, setView] = useState<"list" | "form">("list");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<{id: string, nombre: string} | null>(null);

  // Memorizamos la función para evitar re-renderizados innecesarios
  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true);
      // Sincronización con Backend (Base 1) y Material UI (Base 0)
      const result = await listClientes(page + 1, rowsPerPage, search);
      setClientes(result.docs || []);
      setTotalRecords(result.totalDocs || 0);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (view === "list") cargarClientes();
    }, 400); // Debounce para la búsqueda
    return () => clearTimeout(timer);
  }, [cargarClientes, view]);

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setView("form");
  };

  const handleNew = () => {
    setSelectedCliente(null);
    setView("form");
  };

  const handleDeleteClick = (id: string, nombre: string) => {
    setClienteToDelete({ id, nombre });
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (clienteToDelete) {
      try {
        await deleteCliente(clienteToDelete.id);
        setOpenConfirm(false);
        setClienteToDelete(null);
        cargarClientes();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  if (view === "form") {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => setView("list")} 
          sx={{ mb: 3, fontWeight: 'bold', color: '#64748b', textTransform: 'none' }}
        >
          Volver al Listado
        </Button>
        <ClienteForm 
          clienteEdit={selectedCliente} 
          onSuccess={() => { setView("list"); cargarClientes(); }} 
          onCancel={() => setView("list")}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#eef2ff', color: '#4f69f9', width: 48, height: 48 }}>
              <PeopleIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={800} color="#1e293b">Clientes</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />} 
            onClick={handleNew}
            sx={{ bgcolor: '#4f69f9', borderRadius: 2.5, px: 3, py: 1, textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#3d54d9' } }}
          >
            Nuevo Cliente
          </Button>
        </Box>

        <Box sx={{ px: 3, pb: 3 }}>
          <TextField 
            fullWidth 
            placeholder="Buscar por nombre o identificación..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
              sx: { borderRadius: 3, bgcolor: '#f8fafc', border: 'none' }
            }}
          />
        </Box>

        <TableContainer sx={{ minHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>CLIENTE</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>IDENTIFICACIÓN</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>TELÉFONO</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={40} thickness={4} sx={{ color: '#4f69f9' }} />
                    <Typography sx={{ mt: 2, color: '#64748b' }}>Cargando información...</Typography>
                  </TableCell>
                </TableRow>
              ) : clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography color="textSecondary">No se encontraron clientes</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente) => (
                  <TableRow key={cliente.id_cliente} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="#1e293b">{cliente.nombre}</Typography>
                      <Typography variant="caption" color="textSecondary">{cliente.email || 'Sin correo'}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{cliente.cedula}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{cliente.telefono || '---'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={cliente.isActive !== false ? "Activo" : "Inactivo"} 
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          bgcolor: cliente.isActive !== false ? '#dcfce7' : '#fee2e2',
                          color: cliente.isActive !== false ? '#166534' : '#991b1b'
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEdit(cliente)} sx={{ color: '#4f69f9', '&:hover': { bgcolor: '#eef2ff' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          onClick={() => handleDeleteClick(cliente.id_cliente, cliente.nombre)} 
                          sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination 
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage="Registros por página:"
        />
      </Paper>

      {/* Diálogo de Confirmación mejorado */}
      <Dialog 
        open={openConfirm} 
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#991b1b' }}>
          <WarningIcon /> Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al cliente <strong>{clienteToDelete?.nombre}</strong>? 
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenConfirm(false)} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
            sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}
          >
            Eliminar permanentemente
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}