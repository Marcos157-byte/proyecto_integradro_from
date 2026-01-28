import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, IconButton, CircularProgress,
  Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from "@mui/material";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditRounded as EditIcon,
  DeleteRounded as DeleteIcon,
  PhoneRounded as PhoneIcon,
  EmailRounded as EmailIcon,
  LocationOnRounded as MapIcon
} from "@mui/icons-material";
import type { Proveedor } from "../../types/proveedor.type";
import { createProveedor, deleteProveedor, getProveedores, updateProveedor } from "../../services/proveedorService";

// CORRECCIÓN: Rutas de importación normalizadas
 

export default function ProveedorList() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Paginación (Sincronizada con PostgreSQL)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedProv, setSelectedProv] = useState<Proveedor | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
    direccion: ""
  });

  const cargarProveedores = async () => {
    setLoading(true);
    try {
      const response = await getProveedores({
        page: page + 1, // MUI usa base 0, NestJS base 1
        limit: rowsPerPage,
        search,
        searchField: 'nombre'
      });
      
      // CORRECCIÓN: Estructura de respuesta de PostgreSQL SuccessResponseDto
      if (response.data && response.data.data) {
        setProveedores(response.data.data);
        setTotalDocs(response.data.total);
      }
    } catch (error) {
      console.error("Error cargando proveedores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, [page, rowsPerPage, search]);

  const handleOpenModal = (prov: Proveedor | null = null) => {
    setSelectedProv(prov);
    if (prov) {
      // Cargamos los datos existentes si es edición
      setForm({
        nombre: prov.nombre || "",
        contacto: prov.contacto || "",
        telefono: prov.telefono || "",
        email: prov.email || "",
        direccion: prov.direccion || ""
      });
    } else {
      setForm({ nombre: "", contacto: "", telefono: "", email: "", direccion: "" });
    }
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      if (selectedProv?.id_proveedor) {
        await updateProveedor(selectedProv.id_proveedor, form);
      } else {
        await createProveedor(form);
      }
      setOpenModal(false);
      cargarProveedores();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este proveedor?")) {
      try {
        await deleteProveedor(id);
        cargarProveedores();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Directorio de <span style={{ color: "#3a7afe" }}>Proveedores</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">Contactos comerciales en PostgreSQL.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()} 
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
        >
          Nuevo Proveedor
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {/* Buscador */}
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <TextField 
            fullWidth 
            placeholder="Buscar proveedor por nombre..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ 
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> 
            }} 
            sx={{ bgcolor: 'white' }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Proveedor / Contacto</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Información de Contacto</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ubicación</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : proveedores.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No hay proveedores registrados.</TableCell></TableRow>
              ) : (
                proveedores.map((prov) => (
                  <TableRow key={prov.id_proveedor} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700 }}>{prov.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">Atn: {prov.contacto}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{prov.telefono}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">{prov.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MapIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{prov.direccion}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="info" onClick={() => handleOpenModal(prov)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(prov.id_proveedor)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalDocs}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { 
            setRowsPerPage(parseInt(e.target.value, 10)); 
            setPage(0); 
          }}
        />
      </Paper>

      {/* Modal para Crear/Editar */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedProv ? "Editar Proveedor" : "Registrar Proveedor"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth label="Nombre de la Empresa" 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value})} 
              />
            </Grid>
            <Grid size={{ xs: 12}}>
              <TextField 
                fullWidth label="Nombre del Contacto" 
                value={form.contacto} 
                onChange={(e) => setForm({...form, contacto: e.target.value})} 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth label="Teléfono" 
                value={form.telefono} 
                onChange={(e) => setForm({...form, telefono: e.target.value})} 
              />
            </Grid>
            <Grid size={{ xs: 6}}>
              <TextField 
                fullWidth label="Email" 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})} 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth label="Dirección Física" 
                multiline rows={2} 
                value={form.direccion} 
                onChange={(e) => setForm({...form, direccion: e.target.value})} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={!form.nombre || !form.email}
          >
            Guardar Proveedor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}