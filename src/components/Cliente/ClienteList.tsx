import { useState, useEffect, useCallback } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, IconButton, 
  CircularProgress, TextField, InputAdornment, Button, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip, Stack
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

  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true);
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
    }, 400);
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
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => setView("list")} 
          sx={{ mb: 3, fontWeight: 900, color: '#000', borderRadius: 0, border: '2px solid #000' }}
        >
          VOLVER_AL_LISTADO
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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper elevation={0} sx={{ borderRadius: 0, border: '4px solid #000', overflow: 'hidden', bgcolor: '#fff' }}>
        
        {/* HEADER DE SECCIÓN */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: '4px solid #000' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ bgcolor: '#000', color: '#fff', p: 1, display: 'flex' }}>
              <PeopleIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>BASE_DATOS_CLIENTES</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#666' }}>REGISTROS_TOTALES: {totalRecords}</Typography>
            </Box>
          </Stack>
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />} 
            onClick={handleNew}
            sx={{ 
              bgcolor: '#000', 
              color: '#fff',
              borderRadius: 0, 
              px: 4, 
              py: 1.5, 
              fontWeight: 900, 
              '&:hover': { bgcolor: '#333' },
              border: '2px solid #000'
            }}
          >
            REGISTRAR_NUEVO_CLIENTE
          </Button>
        </Box>

        {/* BARRA DE BÚSQUEDA INDUSTRIAL */}
        <Box sx={{ p: 3, bgcolor: '#f9f9f9', borderBottom: '2px solid #000' }}>
          <TextField 
            fullWidth 
            placeholder="BUSCAR_POR_NOMBRE_O_IDENTIFICACION..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#000' }} /></InputAdornment>,
              sx: { borderRadius: 0, border: '2px solid #000', bgcolor: '#fff', fontWeight: 800, fontFamily: 'monospace' }
            }}
          />
        </Box>

        <TableContainer sx={{ minHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, bgcolor: '#000', color: '#fff' }}>CLIENTE_INFO</TableCell>
                <TableCell sx={{ fontWeight: 900, bgcolor: '#000', color: '#fff' }}>IDENTIFICACION</TableCell>
                <TableCell sx={{ fontWeight: 900, bgcolor: '#000', color: '#fff' }}>CONTACTO</TableCell>
                <TableCell sx={{ fontWeight: 900, bgcolor: '#000', color: '#fff' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, bgcolor: '#000', color: '#fff' }}>LOGS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress color="inherit" thickness={6} />
                    <Typography sx={{ mt: 2, fontWeight: 900, fontFamily: 'monospace' }}>SINCRONIZANDO_DATA...</Typography>
                  </TableCell>
                </TableRow>
              ) : clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography sx={{ fontWeight: 800, color: '#666' }}>SIN_RESULTADOS_EN_SISTEMA</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente) => (
                  <TableRow key={cliente.id_cliente} hover sx={{ borderBottom: '1px solid #eee' }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>{cliente.nombre}</Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#666' }}>{cliente.email || 'NULL'}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{cliente.cedula}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{cliente.telefono || '---'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={cliente.isActive !== false ? "ACTIVE" : "DISABLED"} 
                        size="small"
                        sx={{ 
                          fontWeight: 900,
                          borderRadius: 0,
                          bgcolor: cliente.isActive !== false ? '#000' : '#fff',
                          color: cliente.isActive !== false ? '#fff' : '#000',
                          border: '1px solid #000'
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton 
                          onClick={() => handleEdit(cliente)} 
                          sx={{ border: '1px solid #000', borderRadius: 0, color: '#000', "&:hover": { bgcolor: '#000', color: '#fff' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteClick(cliente.id_cliente, cliente.nombre)} 
                          sx={{ border: '1px solid #000', borderRadius: 0, color: '#ff0000', "&:hover": { bgcolor: '#ff0000', color: '#fff' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
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
          labelRowsPerPage="REGS_POR_PAG:"
          sx={{ borderTop: '2px solid #000', fontWeight: 900 }}
        />
      </Paper>

      {/* Diálogo de Confirmación Brutalista */}
      <Dialog 
        open={openConfirm} 
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 900, color: '#ff0000' }}>
          <WarningIcon /> ELIMINAR_REGISTRO
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#000', fontWeight: 700 }}>
            ¿CONFIRMA LA ELIMINACIÓN PERMANENTE DEL CLIENTE: <span style={{ backgroundColor: '#000', color: '#fff', padding: '0 4px' }}>{clienteToDelete?.nombre}</span>?
            ESTA ACCIÓN NO PUEDE DESHACERSE.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ borderRadius: 0, border: '2px solid #000', color: '#000', fontWeight: 900 }}>
            CANCELAR
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            sx={{ borderRadius: 0, bgcolor: '#ff0000', fontWeight: 900, '&:hover': { bgcolor: '#cc0000' } }}
          >
            CONFIRMAR_ELIMINACION
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}