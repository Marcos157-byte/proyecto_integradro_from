import { useState, useEffect } from "react";
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Avatar, IconButton, 
  Tooltip, TextField, InputAdornment, Button, Pagination, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip
} from "@mui/material";
import { 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  WarningAmber as WarningIcon,
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

  // ESTADOS PARA EDICIÓN Y ELIMINACIÓN
  const [selectedEmpleado, setSelectedEmpleado] = useState<any | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, nombre: string} | null>(null);

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      const res = await listEmpleados(page, 10, filter);
      setEmpleados(res.docs || []);
      setTotalPages(Math.ceil((res.totalDocs || 1) / (res.limit || 10)));
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") cargarEmpleados();
  }, [page, filter, view]);

  // MANEJADORES DE VISTA
  const handleEdit = (emp: any) => {
    setSelectedEmpleado(emp); // Guarda el empleado para que el formulario lo reciba
    setView("form");          // Cambia la vista al formulario
  };

  const handleNew = () => {
    setSelectedEmpleado(null); // Asegura que el formulario esté vacío para un nuevo registro
    setView("form");
  };

  const handleOpenDelete = (id: string, nombre: string, apellido: string) => {
    setItemToDelete({ id, nombre: `${nombre} ${apellido}` });
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteEmpleado(itemToDelete.id);
        setOpenConfirm(false);
        setItemToDelete(null);
        cargarEmpleados();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  if (view === "form") {
    // Se pasa 'selectedEmpleado' como prop; si es null, el formulario será para creación
    return <EmpleadoForm empleado={selectedEmpleado} onSuccess={() => setView("list")} />;
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Gestión de Empleados
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar por nombre o cédula..."
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ bgcolor: 'white', borderRadius: 2, width: 320 }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleNew}
            sx={{ bgcolor: '#4f69f9', borderRadius: 2, fontWeight: 700 }}
          >
            Nuevo Empleado
          </Button>
        </Box>
      </Box>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafd' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>EMPLEADO</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CÉDULA / ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CARGO / ROLES</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 8 }}><CircularProgress /></TableCell></TableRow>
            ) : (
              empleados.map((emp) => (
                <TableRow key={emp.id_empleado} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#eef2ff', color: '#4f69f9', fontWeight: 'bold' }}>
                        {emp.nombre.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {emp.nombre} {emp.apellido}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <MailIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {emp.usuario?.email || emp.correo || 'Sin correo'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{emp.cedula}</Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                        {emp.cargo?.toUpperCase() || 'GENERAL'}
                      </Typography>
                      {/* Visualización de roles asignados desde el sistema de usuarios */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {emp.usuario?.rolUsuarios?.length > 0 ? (
                          emp.usuario.rolUsuarios.map((ru: any) => (
                            <Chip 
                              key={ru.rol.id_rol} 
                              label={ru.rol.rol.toLowerCase()} 
                              size="small" 
                              sx={{ bgcolor: '#dcfce7', color: '#166534', fontSize: '0.65rem', fontWeight: 700, height: 20 }} 
                            />
                          ))
                        ) : (
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                            Sin acceso al sistema
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#4f69f9' }} 
                        onClick={() => handleEdit(emp)} // Activa la edición
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleOpenDelete(emp.id_empleado, emp.nombre, emp.apellido)}
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
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      </TableContainer>

      {/* DIÁLOGO DE CONFIRMACIÓN */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 800 }}>
          <WarningIcon color="error" /> ¿Confirmar eliminación?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar a <strong>{itemToDelete?.nombre}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}