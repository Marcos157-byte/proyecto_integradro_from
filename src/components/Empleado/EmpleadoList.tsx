import { useState, useEffect } from "react";
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Avatar, IconButton, 
  TextField, InputAdornment, Button, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip, Stack
} from "@mui/material";
// CORRECCIÓN: Uso de Grid v2 para alineación con las nuevas versiones de MUI
import Grid from "@mui/material/Grid"; 
import { 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  MailOutline as MailIcon
} from "@mui/icons-material";

import { listEmpleados, deleteEmpleado } from "../../services/empleadoService";
import EmpleadoForm from "./EmpleadoForm"; 

export default function EmpleadoList() {
  const [view, setView] = useState<"list" | "form">("list");
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedEmpleado, setSelectedEmpleado] = useState<any | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, nombre: string} | null>(null);

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      // Llamada al servicio con parámetros de paginación y búsqueda
      const res = await listEmpleados(page, 10, filter);
      setEmpleados(res.docs || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Error al cargar empleados en el componente:", error);
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce para optimizar las peticiones de búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (view === "list") cargarEmpleados();
    }, 600); 

    return () => clearTimeout(delayDebounceFn);
  }, [page, filter, view]);

  const handleEdit = (emp: any) => {
    setSelectedEmpleado(emp);
    setView("form");
  };

  const handleNew = () => {
    setSelectedEmpleado(null);
    setView("form");
  };

  const handleOpenDelete = (id: string, nombre: string, apellido: string) => {
    setItemToDelete({ id, nombre: `${nombre || ''} ${apellido || ''}`.trim() });
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteEmpleado(itemToDelete.id); // Llamada al servicio de eliminación
        setOpenConfirm(false);
        setItemToDelete(null);
        cargarEmpleados();
      } catch (error) {
        console.error("Error al eliminar registro:", error);
      }
    }
  };

  // ESTILOS BRUTALISTAS
  const brutalBox = {
    borderRadius: 0,
    border: '4px solid #000',
    boxShadow: '10px 10px 0px #000',
    bgcolor: '#fff',
    overflow: 'hidden'
  };

  const headerStyle = {
    fontWeight: 900,
    textTransform: 'uppercase',
    color: '#000',
    borderBottom: '3px solid #000',
    fontFamily: 'monospace'
  };

  if (view === "form") {
    return <EmpleadoForm empleado={selectedEmpleado} onSuccess={() => setView("list")} />;
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f0f0f0', minHeight: '100vh' }}>
      
      {/* HEADER CON GRID2 */}
      <Grid container spacing={2} alignItems="flex-end" sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#000', mb: 0.5, letterSpacing: -1 }}>
            REGISTRO_EMPLEADOS
          </Typography>
          <Typography sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#3a7afe', fontSize: '0.9rem' }}>
            DENIM_LAB // RECURSOS_HUMANOS_SISTEMA
          </Typography>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <TextField
              size="small"
              placeholder="BUSCAR_POR_NOMBRE..."
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#000' }} /></InputAdornment>,
                sx: { borderRadius: 0, border: '3px solid #000', bgcolor: '#fff', fontWeight: 800, '& fieldset': { border: 'none' } }
              }}
              sx={{ width: { xs: '100%', md: 320 } }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleNew}
              sx={{ 
                bgcolor: '#000', color: '#fff', borderRadius: 0, fontWeight: 900, px: 3, border: '3px solid #000',
                '&:hover': { bgcolor: '#333', transform: 'translate(-2px, -2px)', boxShadow: '4px 4px 0px #3a7afe' }
              }}
            >
              NUEVO Empleado
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={brutalBox}>
        <Table>
          <TableHead sx={{ bgcolor: '#eee' }}>
            <TableRow>
              <TableCell sx={headerStyle}>IDENTIDAD_EMPLEADO</TableCell>
              <TableCell sx={headerStyle}>CÉDULA / ID</TableCell>
              <TableCell sx={headerStyle}>CARGO / PERMISOS</TableCell>
              <TableCell align="right" sx={headerStyle}>ACCIONES_SISTEMA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                  <CircularProgress color="inherit" thickness={5} />
                  <Typography sx={{ fontWeight: 900, mt: 2, fontFamily: 'monospace' }}>QUERY_IN_PROGRESS...</Typography>
                </TableCell>
              </TableRow>
            ) : (
              empleados.map((emp) => (
                <TableRow key={emp.id_empleado} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#000', color: '#fff', fontWeight: 900, borderRadius: 0, border: '2px solid #000' }}>
                        {emp.nombre?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>
                          {`${emp.nombre || ''} ${emp.apellido || ''}`.toUpperCase()}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <MailIcon sx={{ fontSize: 14, color: '#666' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#666' }}>
                            {/* CORRECCIÓN: Acceso a la relación 'usuarios' definida en el backend */}
                            {emp.usuarios && emp.usuarios.length > 0 ? emp.usuarios[0].email : 'OFFLINE'}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 900, bgcolor: '#f0f0f0', p: 0.5, border: '1px solid #000', display: 'inline-block' }}>
                      {emp.cedula || '---'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: '#3a7afe', display: 'block', mb: 0.5 }}>
                        {emp.cargo?.toUpperCase() || 'GENERAL'}
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {/* CORRECCIÓN: Mapeo de roles desde el array 'usuarios' */}
                        {emp.usuarios && emp.usuarios[0]?.rolUsuarios?.length > 0 ? (
                          emp.usuarios[0].rolUsuarios.map((ru: any) => (
                            <Chip 
                              key={ru.rol?.id_rol || Math.random()} 
                              label={ru.rol?.rol?.toUpperCase() || 'S/R'} 
                              size="small" 
                              sx={{ bgcolor: '#000', color: '#fff', borderRadius: 0, fontWeight: 900, fontSize: '0.6rem', height: 20 }} 
                            />
                          ))
                        ) : (
                          <Typography variant="caption" sx={{ color: '#999', fontWeight: 800 }}>SIN_ACCESO</Typography>
                        )}
                      </Stack>
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton onClick={() => handleEdit(emp)} sx={{ border: '2px solid #000', borderRadius: 0, '&:hover': { bgcolor: '#000', color: '#fff' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleOpenDelete(emp.id_empleado, emp.nombre, emp.apellido)} 
                        sx={{ border: '2px solid #000', borderRadius: 0, color: '#ff4d4d', '&:hover': { bgcolor: '#ff4d4d', color: '#fff' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
            {!loading && empleados.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5, fontWeight: 800, color: '#999', fontFamily: 'monospace' }}>
                  DATA_NOT_FOUND // NO_SE_ENCONTRARON_RESULTADOS
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', borderTop: '4px solid #000', bgcolor: '#f9f9f9' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, v) => setPage(v)} 
            shape="rounded"
            sx={{ 
              '& .MuiPaginationItem-root': { 
                borderRadius: 0, 
                border: '2px solid #000', 
                fontWeight: 900,
                '&.Mui-selected': { bgcolor: '#000', color: '#fff' }
              } 
            }} 
          />
        </Box>
      </TableContainer>

      {/* DIÁLOGO BORRADO */}
      <Dialog 
        open={openConfirm} 
        onClose={() => setOpenConfirm(false)} 
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000', boxShadow: '8px 8px 0px #000' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, bgcolor: '#000', color: '#fff', mb: 2 }}>SISTEMA: CONFIRMAR_BAJA</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#000', fontWeight: 800 }}>
            ¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE: <span style={{ color: '#3a7afe' }}>{itemToDelete?.nombre?.toUpperCase()}</span>?
            ESTA_ACCIÓN_ES_IRREVERSIBLE.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ fontWeight: 900, color: '#000' }}>CANCELAR</Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            sx={{ bgcolor: '#ff4d4d', borderRadius: 0, fontWeight: 900, border: '2px solid #000' }}
          >
            CONFIRMAR_ELIMINACIÓN
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}