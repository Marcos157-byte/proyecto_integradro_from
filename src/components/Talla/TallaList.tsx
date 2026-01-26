import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, IconButton, CircularProgress,
  Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert
} from "@mui/material";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditRounded as EditIcon,
  DeleteRounded as DeleteIcon
} from "@mui/icons-material";
import type { Talla } from "../../types/talla.types";
import { createTalla, deleteTalla, getTallas, updateTalla } from "../../services/tallaService";

// Importamos las funciones del service


export default function TallaList() {
  const [tallas, setTallas] = useState<Talla[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedTalla, setSelectedTalla] = useState<Talla | null>(null);
  const [nombreForm, setNombreForm] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");

  const cargarTallas = async () => {
    setLoading(true);
    try {
      const response = await getTallas(page + 1, rowsPerPage, search);
      // Usamos .docs porque viene de PaginatedResponseMongo
      setTallas(response.data.docs);
      setTotalDocs(response.data.totalDocs);
    } catch (error) {
      console.error("Error cargando tallas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTallas();
  }, [page, rowsPerPage, search]);

  const handleOpenModal = (talla: Talla | null = null) => {
    setSelectedTalla(talla);
    setNombreForm(talla ? talla.nombre : "");
    setErrorValidacion("");
    setOpenModal(true);
  };

  const handleSave = async () => {
    // Validación: Solo letras (como en tu Schema de NestJS)
    if (!/^[A-Za-z]+$/.test(nombreForm)) {
      setErrorValidacion("La talla solo puede contener letras (Ej: XL, M, S)");
      return;
    }

    try {
      if (selectedTalla) {
        await updateTalla(selectedTalla.id_talla, { nombre: nombreForm });
      } else {
        await createTalla({ nombre: nombreForm });
      }
      setOpenModal(false);
      cargarTallas();
    } catch (error) {
      console.error("Error al guardar talla:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta talla?")) {
      await deleteTalla(id);
      cargarTallas();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de <span style={{ color: "#3a7afe" }}>Tallas</span></Typography>
          <Typography variant="body1" color="text.secondary">Configuración de dimensiones en MongoDB.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()} sx={{ borderRadius: 2 }}>
          Nueva Talla
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {/* Search Bar */}
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <TextField 
            fullWidth placeholder="Buscar talla (ej: XL)..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} 
            sx={{ bgcolor: 'white' }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Talla</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>UUID Identificador</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : tallas.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}>No hay tallas registradas.</TableCell></TableRow>
              ) : (
                tallas.map((t) => (
                  <TableRow key={t.id_talla} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: "#3a7afe", fontSize: '1.1rem' }}>{t.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">{t.id_talla}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="info" onClick={() => handleOpenModal(t)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(t.id_talla)}><DeleteIcon fontSize="small" /></IconButton>
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
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>

      {/* Modal para Crear/Editar */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>{selectedTalla ? "Editar Talla" : "Registrar Talla"}</DialogTitle>
        <DialogContent dividers>
          {errorValidacion && <Alert severity="error" sx={{ mb: 2 }}>{errorValidacion}</Alert>}
          <TextField 
            fullWidth label="Nombre de la Talla" 
            placeholder="Ej: XL" 
            sx={{ mt: 1 }} 
            value={nombreForm}
            onChange={(e) => {
                setNombreForm(e.target.value.toUpperCase());
                setErrorValidacion("");
            }}
            helperText="Solo se permiten letras"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!nombreForm}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}