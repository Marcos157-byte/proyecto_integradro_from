import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, IconButton, Tooltip, CircularProgress,
  Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditRounded as EditIcon,
  DeleteRounded as DeleteIcon
} from "@mui/icons-material";
import { categoriaService } from "../../services/categoriaService";
import type { Categoria } from "../../types/categoria.types";

export default function CategoriaList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  // Estados para Modal de Creación/Edición
  const [openModal, setOpenModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Categoria | null>(null);
  const [nombreForm, setNombreForm] = useState("");

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const response = await categoriaService.findAll({
        page: page + 1,
        limit: rowsPerPage,
        search,
        searchField: 'nombre'
      });
      
      // Ajustamos según tu interfaz CategoriasPaginadasResponse
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
    setNombreForm(cat ? cat.nombre : "");
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      if (selectedCat) {
        await categoriaService.update(selectedCat.id_categoria, { nombre: nombreForm });
      } else {
        await categoriaService.create({ nombre: nombreForm });
      }
      setOpenModal(false);
      cargarCategorias();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      await categoriaService.remove(id);
      cargarCategorias();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Categorías <span style={{ color: "#3a7afe" }}>de Productos</span></Typography>
          <Typography variant="body1" color="text.secondary">Organización de stock en MongoDB.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()} sx={{ borderRadius: 2 }}>
          Nueva Categoría
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <TextField 
            fullWidth placeholder="Buscar categoría..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} 
            sx={{ bgcolor: 'white' }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Nombre de Categoría</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ID (UUID)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : (
                categorias.map((cat) => (
                  <TableRow key={cat.id_categoria} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{cat.nombre}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{cat.id_categoria}</TableCell>
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

      {/* Modal Genérico para Crear/Editar */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>{selectedCat ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth label="Nombre" sx={{ mt: 2 }} value={nombreForm}
            onChange={(e) => setNombreForm(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!nombreForm}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}