import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, IconButton, CircularProgress,
  Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Stack} from "@mui/material";
import Grid from "@mui/material/Grid";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditNote as EditIcon,
  DeleteForever as DeleteIcon,
  PhoneIphone as PhoneIcon,
  AlternateEmail as EmailIcon,
  Business as MapIcon,
  ContactPage as ContactIcon
} from "@mui/icons-material";
import type { Proveedor } from "../../types/proveedor.type";
import { createProveedor, deleteProveedor, getProveedores, updateProveedor } from "../../services/proveedorService";

export default function ProveedorList() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Paginación
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
        page: page + 1,
        limit: rowsPerPage,
        search,
        searchField: 'nombre'
      });
      
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
    if (window.confirm("¿CONFIRMAR ELIMINACIÓN PERMANENTE DE ESTE PROVEEDOR?")) {
      try {
        await deleteProveedor(id);
        cargarProveedores();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f1f5f9', minHeight: '100vh' }}>
      {/* HEADER INDUSTRIAL */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '4px solid #000', pb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '2.5rem', lineHeight: 1, letterSpacing: -1 }}>
            CONTROL_DE_<span style={{ color: "#3a7afe" }}>PROVEEDORES</span>
          </Typography>
          <Typography sx={{ fontWeight: 700, mt: 1, fontFamily: 'monospace', color: 'text.secondary' }}>
            REGISTRO_POSTGRESQL // v2.0.26
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()} 
          sx={{ borderRadius: 0, bgcolor: '#000', px: 4, py: 1.5, fontWeight: 900, '&:hover': { bgcolor: '#333' } }}
        >
          NUEVO_REGISTRO
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 0, border: '4px solid #000', boxShadow: 'none', overflow: 'hidden' }}>
        {/* BARRA DE BÚSQUEDA TÉCNICA */}
        <Box sx={{ p: 2, bgcolor: '#000', display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField 
            fullWidth 
            placeholder="BUSCAR_POR_NOMBRE_DE_EMPRESA..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ 
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#fff' }} /></InputAdornment>,
                sx: { color: '#fff', fontWeight: 700, fontFamily: 'monospace', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }
            }} 
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: "#f8fafc", borderBottom: '2px solid #000' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>EMPRESA_DATOS</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>CANALES_DE_CONTACTO</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>UBICACIÓN_FÍSICA</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900, fontSize: '0.75rem' }}>OPERACIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><CircularProgress color="inherit" thickness={6} /></TableCell></TableRow>
              ) : proveedores.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10, fontWeight: 800 }}>SIN_REGISTROS_COINCIDENTES</TableCell></TableRow>
              ) : (
                proveedores.map((prov) => (
                  <TableRow key={prov.id_proveedor} hover sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 900, color: '#000' }}>{prov.nombre.toUpperCase()}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ContactIcon sx={{ fontSize: 14, color: '#3a7afe' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>ATN: {prov.contacto.toUpperCase()}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: '#000' }} />
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>{prov.telefono}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#000' }} />
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>{prov.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <MapIcon sx={{ fontSize: 16, color: '#000', mt: 0.3 }} />
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: 250 }}>{prov.direccion.toUpperCase()}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        sx={{ border: '2px solid #000', borderRadius: 0, mr: 1, bgcolor: '#fff', '&:hover': { bgcolor: '#3a7afe', color: '#fff' } }} 
                        onClick={() => handleOpenModal(prov)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        sx={{ border: '2px solid #000', borderRadius: 0, bgcolor: '#fff', '&:hover': { bgcolor: '#ef4444', color: '#fff' } }} 
                        onClick={() => handleDelete(prov.id_proveedor)}
                      >
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
          sx={{ borderTop: '2px solid #000', bgcolor: '#f8fafc', fontWeight: 900 }}
        />
      </Paper>

      {/* MODAL INDUSTRIAL CREAR/EDITAR */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000' } }}
      >
        <DialogTitle sx={{ bgcolor: '#000', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {selectedProv ? <EditIcon /> : <AddIcon />}
          {selectedProv ? "MODIFICAR_PROVEEDOR" : "REGISTRAR_NUEVO_PROVEEDOR"}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField 
                fullWidth label="RAZÓN_SOCIAL" 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value.toUpperCase()})}
                InputProps={{ sx: { borderRadius: 0, fontWeight: 800 } }}
              />
            </Grid>
            <Grid size={12}>
              <TextField 
                fullWidth label="PERSONAL_DE_CONTACTO" 
                value={form.contacto} 
                onChange={(e) => setForm({...form, contacto: e.target.value.toUpperCase()})}
                InputProps={{ sx: { borderRadius: 0, fontWeight: 800 } }}
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                fullWidth label="TELÉFONO_RED" 
                value={form.telefono} 
                onChange={(e) => setForm({...form, telefono: e.target.value})}
                InputProps={{ sx: { borderRadius: 0, fontWeight: 800, fontFamily: 'monospace' } }}
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                fullWidth label="EMAIL_CORPORATIVO" 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}
                InputProps={{ sx: { borderRadius: 0, fontWeight: 800, fontFamily: 'monospace' } }}
              />
            </Grid>
            <Grid size={12}>
              <TextField 
                fullWidth label="DIRECCIÓN_FISCAL_COMPLETA" 
                multiline rows={3} 
                value={form.direccion} 
                onChange={(e) => setForm({...form, direccion: e.target.value.toUpperCase()})}
                InputProps={{ sx: { borderRadius: 0, fontWeight: 800 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '2px solid #000' }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button 
              fullWidth onClick={() => setOpenModal(false)} 
              variant="outlined"
              sx={{ borderRadius: 0, border: '2px solid #000', color: '#000', fontWeight: 900 }}
            >
              CANCELAR
            </Button>
            <Button 
              fullWidth variant="contained" 
              onClick={handleSave} 
              disabled={!form.nombre || !form.email}
              sx={{ borderRadius: 0, bgcolor: '#000', fontWeight: 900, '&:hover': { bgcolor: '#333' } }}
            >
              GUARDAR_CAMBIOS
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}