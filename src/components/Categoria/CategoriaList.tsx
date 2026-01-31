import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, IconButton, CircularProgress,
  Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Stack} from "@mui/material";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditNote as EditIcon,
  DeleteForever as DeleteIcon,
  CategoryRounded as CategoryIcon} from "@mui/icons-material";

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
    // Validación lógica: Solo letras y espacios
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)) {
      setErrorValidacion("ERROR_SINTAXIS: EL NOMBRE SOLO PERMITE CARACTERES ALFABÉTICOS");
      return;
    }

    try {
      if (selectedCat) {
        await updateCategoria(selectedCat.id_categoria, formData);
      } else {
        await createCategoria(formData);
      }
      setOpenModal(false);
      cargarCategorias();
    } catch (error: any) {
      setErrorValidacion(error.response?.data?.message || "ERROR_SISTEMA: FALLO AL GUARDAR");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿CONFIRMAR ELIMINACIÓN DE CATEGORÍA? ESTA ACCIÓN NO SE PUEDE DESHACER")) {
      try {
        await deleteCategoria(id);
        cargarCategorias();
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
            MAESTRO_DE_<span style={{ color: "#3a7afe" }}>CATEGORÍAS</span>
          </Typography>
          <Typography sx={{ fontWeight: 700, mt: 1, fontFamily: 'monospace', color: 'text.secondary' }}>
            DATOS_COMPARTIDOS // MONGODB_ALTA_DISPONIBILIDAD
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()} 
          sx={{ borderRadius: 0, bgcolor: '#000', px: 4, py: 1.5, fontWeight: 900, '&:hover': { bgcolor: '#333' } }}
        >
          NUEVA_CATEGORÍA
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 0, border: '4px solid #000', boxShadow: 'none', overflow: 'hidden' }}>
        {/* BARRA DE BÚSQUEDA */}
        <Box sx={{ p: 2, bgcolor: '#000' }}>
          <TextField 
            fullWidth 
            placeholder="BUSCAR_CATEGORIA_POR_NOMBRE..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ 
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#fff' }} /></InputAdornment>,
                sx: { color: '#fff', fontWeight: 700, fontFamily: 'monospace', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }
            }} 
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc", borderBottom: '2px solid #000' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem', width: '30%' }}>IDENTIFICADOR_CATEGORÍA</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>DESCRIPCIÓN_SISTEMA</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900, fontSize: '0.75rem' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 10 }}><CircularProgress color="inherit" thickness={6} /></TableCell></TableRow>
              ) : categorias.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 10, fontWeight: 800 }}>SIN_CATEGORIAS_REGISTRADAS</TableCell></TableRow>
              ) : (
                categorias.map((cat) => (
                  <TableRow key={cat.id_categoria} hover sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CategoryIcon sx={{ color: '#3a7afe' }} />
                        <Typography sx={{ fontWeight: 900, color: '#000' }}>{cat.nombre.toUpperCase()}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.secondary' }}>
                        {cat.descripcion.toUpperCase() || "SIN_DESCRIPCIÓN_ASIGNADA"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        sx={{ border: '2px solid #000', borderRadius: 0, mr: 1, bgcolor: '#fff', '&:hover': { bgcolor: '#3a7afe', color: '#fff' } }} 
                        onClick={() => handleOpenModal(cat)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        sx={{ border: '2px solid #000', borderRadius: 0, bgcolor: '#fff', '&:hover': { bgcolor: '#ef4444', color: '#fff' } }} 
                        onClick={() => handleDelete(cat.id_categoria)}
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

      {/* MODAL INDUSTRIAL REUTILIZABLE */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000' } }}
      >
        <DialogTitle sx={{ bgcolor: '#000', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {selectedCat ? <EditIcon /> : <AddIcon />}
          {selectedCat ? "EDITAR_CATEGORÍA" : "NUEVA_CATEGORÍA"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {errorValidacion && (
            <Alert severity="error" variant="filled" sx={{ mb: 2, borderRadius: 0, fontWeight: 700 }}>
              {errorValidacion}
            </Alert>
          )}
          
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField 
              fullWidth 
              label="NOMBRE_CATEGORÍA" 
              value={formData.nombre}
              onChange={(e) => {
                  setFormData({...formData, nombre: e.target.value.toUpperCase()});
                  setErrorValidacion("");
              }}
              InputProps={{ sx: { borderRadius: 0, fontWeight: 800 } }}
              helperText="SOLO CARACTERES ALFABÉTICOS"
            />

            <TextField 
              fullWidth 
              label="DESCRIPCIÓN_SISTEMA" 
              multiline 
              rows={3}
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value.toUpperCase()})}
              InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '2px solid #000' }}>
          <Button 
            onClick={() => setOpenModal(false)} 
            sx={{ fontWeight: 900, color: '#000' }}
          >
            CANCELAR
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={!formData.nombre || !formData.descripcion}
            sx={{ borderRadius: 0, bgcolor: '#000', fontWeight: 900, px: 3, '&:hover': { bgcolor: '#333' } }}
          >
            GUARDAR_CAMBIOS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}