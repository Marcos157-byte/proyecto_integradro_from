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
  PaletteRounded as ColorIcon
} from "@mui/icons-material";

// Importamos servicios y NUESTRA interfaz Color (no la de MUI)
import { createColor, deleteColor, getColores, updateColor } from "../../services/colorService";
import type { Color } from "../../types/color.types";

export default function ColorList() {
  const [colores, setColores] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [form, setForm] = useState({ color: "" });

  const cargarColores = async () => {
    setLoading(true);
    try {
      const response = await getColores({
        page: page + 1,
        limit: rowsPerPage,
        search,
        searchField: 'color'
      });

      // CORRECCIÓN: Acceso según ColoresPaginadosResponse
      // response es el objeto que viene del service
      if (response.data) {
        setColores(response.data.data); // El array está en data.data
        setTotalDocs(response.data.total); // El total está en data.total
      }
    } catch (error) {
      console.error("Error cargando colores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarColores();
  }, [page, rowsPerPage, search]);

  const handleOpenModal = (colorObj: Color | null = null) => {
    setSelectedColor(colorObj);
    setForm({ color: colorObj ? colorObj.color : "" });
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!form.color.trim()) return;
    try {
      if (selectedColor) {
        await updateColor(selectedColor.id_color, form);
      } else {
        await createColor(form);
      }
      setOpenModal(false);
      cargarColores();
    } catch (error) {
      console.error("Error al guardar color:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este color?")) {
      try {
        await deleteColor(id);
        cargarColores();
      } catch (error) {
        console.error("Error al eliminar color:", error);
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ColorIcon sx={{ fontSize: 40, color: '#3a7afe' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>Paleta de <span style={{ color: "#3a7afe" }}>Colores</span></Typography>
            <Typography variant="body1" color="text.secondary">Gestión de atributos PostgreSQL.</Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()} 
          sx={{ borderRadius: 2, px: 3 }}
        >
          Nuevo Color
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <TextField 
            fullWidth 
            placeholder="Buscar color..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> 
            }} 
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID (UUID)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre del Color</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>
              ) : colores.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center">No hay registros.</TableCell></TableRow>
              ) : (
                colores.map((c) => (
                  <TableRow key={c.id_color} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.id_color}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#3a7afe' }} />
                        <Typography sx={{ fontWeight: 600 }}>{c.color}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="info" onClick={() => handleOpenModal(c)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(c.id_color)}><DeleteIcon fontSize="small" /></IconButton>
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

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedColor ? "Editar Color" : "Nuevo Color"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField 
            fullWidth 
            label="Nombre del Color" 
            value={form.color} 
            onChange={(e) => setForm({ color: e.target.value })} 
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.color.trim()}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}