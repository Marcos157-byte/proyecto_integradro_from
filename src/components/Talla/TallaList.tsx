import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, IconButton, CircularProgress,
  Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Stack, Divider
} from "@mui/material";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditNote as EditIcon,
  DeleteForever as DeleteIcon,
  StraightenRounded as RulerIcon,
  DeveloperMode as CodeIcon
} from "@mui/icons-material";
import type { Talla } from "../../types/talla.types";
import { createTalla, deleteTalla, getTallas, updateTalla } from "../../services/tallaService";

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
    if (!/^[A-Za-z]+$/.test(nombreForm)) {
      setErrorValidacion("ERROR_FORMATO: SE REQUIEREN CARACTERES ALFABÉTICOS (EJ: XL, M, S)");
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
    if (window.confirm("¿CONFIRMAR ELIMINACIÓN DE REGISTRO TÉCNICO?")) {
      await deleteTalla(id);
      cargarTallas();
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* HEADER INDUSTRIAL */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '4px solid #000', pb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: '2.5rem', lineHeight: 1, letterSpacing: -2 }}>
            SISTEMA_DE_<span style={{ color: "#3a7afe" }}>TALLAS</span>
          </Typography>
          <Typography sx={{ fontWeight: 700, mt: 1, fontFamily: 'monospace', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon fontSize="small" /> MONGODB_COLLECTION // DIMENSION_UNIT
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()} 
          sx={{ borderRadius: 0, bgcolor: '#000', px: 4, py: 1.5, fontWeight: 900, '&:hover': { bgcolor: '#333' } }}
        >
          NUEVA_DIMENSIÓN
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 0, border: '4px solid #000', boxShadow: 'none', overflow: 'hidden' }}>
        {/* BARRA DE BÚSQUEDA TÉCNICA */}
        <Box sx={{ p: 2, bgcolor: '#000' }}>
          <TextField 
            fullWidth 
            placeholder="BUSCAR_TALLA_POR_CÓDIGO..." 
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
                <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>VALOR_NOMINAL</TableCell>
                <TableCell sx={{ fontWeight: 900, fontSize: '0.75rem' }}>IDENTIFICADOR_SISTEMA (UUID)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900, fontSize: '0.75rem' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 8 }}><CircularProgress color="inherit" thickness={5} /></TableCell></TableRow>
              ) : tallas.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 8, fontWeight: 800 }}>SIN_DATOS_REGISTRADOS</TableCell></TableRow>
              ) : (
                tallas.map((t) => (
                  <TableRow key={t.id_talla} hover sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ bgcolor: '#000', color: '#fff', px: 2, py: 0.5, fontWeight: 900, fontSize: '1.2rem' }}>
                          {t.nombre}
                        </Box>
                        <RulerIcon sx={{ color: '#ccc' }} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary', fontWeight: 600 }}>
                        {t.id_talla}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        sx={{ border: '2px solid #000', borderRadius: 0, mr: 1, '&:hover': { bgcolor: '#000', color: '#fff' } }} 
                        onClick={() => handleOpenModal(t)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        sx={{ border: '2px solid #000', borderRadius: 0, '&:hover': { bgcolor: '#ef4444', color: '#fff', borderColor: '#ef4444' } }} 
                        onClick={() => handleDelete(t.id_talla)}
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
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          sx={{ borderTop: '2px solid #000', bgcolor: '#f8fafc', fontWeight: 900 }}
        />
      </Paper>

      {/* MODAL TALLA INDUSTRIAL */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000' } }}
      >
        <DialogTitle sx={{ bgcolor: '#000', color: '#fff', fontWeight: 900, letterSpacing: 1 }}>
          {selectedTalla ? "EDITAR_REGISTRO" : "NUEVO_REGISTRO"}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {errorValidacion && <Alert severity="error" variant="filled" sx={{ borderRadius: 0, fontWeight: 700 }}>{errorValidacion}</Alert>}
            
            <TextField 
              fullWidth 
              label="NOMBRE_DE_LA_TALLA" 
              placeholder="EJ: XXL" 
              value={nombreForm}
              onChange={(e) => {
                  setNombreForm(e.target.value.toUpperCase());
                  setErrorValidacion("");
              }}
              helperText="ADMITA SOLO CARACTERES ALFABÉTICOS"
              slotProps={{ 
                input: { sx: { borderRadius: 0, fontWeight: 900, fontSize: '1.5rem', textAlign: 'center' } },
                formHelperText: { sx: { fontWeight: 700, fontFamily: 'monospace' } }
              }}
            />
          </Stack>
        </DialogContent>
        <Divider sx={{ borderBottomWidth: 2, borderColor: '#000' }} />
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button onClick={() => setOpenModal(false)} sx={{ fontWeight: 900, color: '#000' }}>CANCELAR</Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={!nombreForm}
            sx={{ borderRadius: 0, bgcolor: '#000', fontWeight: 900, px: 4, '&:hover': { bgcolor: '#333' } }}
          >
            CONFIRMAR_DATOS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}