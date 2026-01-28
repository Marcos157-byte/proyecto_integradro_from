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

import type { Categoria } from "../../types/categoria.types";
import { 
  getCategorias, 
  createCategoria, 
  updateCategoria, 
  deleteCategoria 
} from "../../services/categoriaService";

export default function CategoriaList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [errorValidacion, setErrorValidacion] = useState("");

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      // page + 1 porque el backend inicia en 1
      const response = await getCategorias(page + 1, rowsPerPage, search);
      setCategorias(response.data.docs);
      setTotalDocs(response.data.totalDocs);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, [page, rowsPerPage, search]);

  const handleOpenModal = (cat: Categoria | null = null) => {
    setSelectedCat(cat);
    setFormData({
      nombre: cat ? cat.nombre : "",
      descripcion: cat ? cat.descripcion : ""
    });
    setErrorValidacion("");
    setOpenModal(true);
  };

  const handleSave = async () => {
    // Validación: Solo letras y espacios (como en tu Schema)
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)) {
      setErrorValidacion("El nombre solo puede contener letras y espacios");
      return;
    }

    try {
      if (selectedCat) {
        // Usamos id_categoria (el UUID) para el PUT
        await updateCategoria(selectedCat.id_categoria, formData);
      } else {
        await createCategoria(formData);
      }
      setOpenModal(false);
      cargarCategorias();
    } catch (error: any) {
      setErrorValidacion(error.response?.data?.message || "Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await deleteCategoria(id);
        cargarCategorias();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de <span style={{ color: "#3a7afe" }}>Categorías</span></Typography>
          <Typography variant="body1" color="text.secondary">Clasificación de productos en MongoDB.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()} sx={{ borderRadius: 2 }}>
          Nueva Categoría
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {/* Barra de Búsqueda */}
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <TextField 
            fullWidth 
            placeholder="Buscar por nombre..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} 
            sx={{ bgcolor: 'white' }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : categorias.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}>No hay categorías registradas.</TableCell></TableRow>
              ) : (
                categorias.map((cat) => (
                  <TableRow key={cat.id_categoria} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>{cat.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{cat.descripcion}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="info" onClick={() => handleOpenModal(cat)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(cat.id_categoria)}><DeleteIcon fontSize="small" /></IconButton>
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

      {/* Modal Reutilizable */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>{selectedCat ? "Editar Categoría" : "Registrar Categoría"}</DialogTitle>
        <DialogContent dividers>
          {errorValidacion && <Alert severity="error" sx={{ mb: 2 }}>{errorValidacion}</Alert>}
          
          <TextField 
            fullWidth label="Nombre" 
            sx={{ mt: 1, mb: 2 }} 
            value={formData.nombre}
            onChange={(e) => {
                setFormData({...formData, nombre: e.target.value});
                setErrorValidacion("");
            }}
          />

          <TextField 
            fullWidth label="Descripción" 
            multiline rows={3}
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!formData.nombre || !formData.descripcion}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}