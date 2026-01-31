import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, IconButton, CircularProgress,
  Button, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, Tooltip
} from "@mui/material";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditNote as EditIcon,
  DeleteForever as DeleteIcon,
  PaletteRounded as ColorIcon,
  Fingerprint as IDIcon
} from "@mui/icons-material";

import { createColor, deleteColor, getColores, updateColor } from "../../services/colorService";
import type { Color } from "../../types/color.types";

// Diccionario extendido para la visualización dinámica
const COLOR_MAP: Record<string, string> = {
  "ROJO": "#FF0000", "RED": "#FF0000",
  "AZUL": "#0000FF", "BLUE": "#0000FF",
  "VERDE": "#008000", "GREEN": "#008000",
  "AMARILLO": "#FFFF00", "YELLOW": "#FFFF00",
  "NEGRO": "#000000", "BLACK": "#000000",
  "BLANCO": "#FFFFFF", "WHITE": "#FFFFFF",
  "GRIS": "#808080", "GRAY": "#808080",
  "NARANJA": "#FFA500", "ORANGE": "#FFA500",
  "ROSA": "#FFC0CB", "PINK": "#FFC0CB",
  "MORADO": "#800080", "PURPLE": "#800080",
  "CAFE": "#A52A2A", "BROWN": "#A52A2A",
  "CIAN": "#00FFFF", "CYAN": "#00FFFF",
  "MAGENTA": "#FF00FF",
};

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

      if (response.data) {
        setColores(response.data.data);
        setTotalDocs(response.data.total);
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
      const payload = { color: form.color.toUpperCase().trim() };
      if (selectedColor) {
        await updateColor(selectedColor.id_color, payload);
      } else {
        await createColor(payload);
      }
      setOpenModal(false);
      cargarColores();
    } catch (error) {
      console.error("Error al guardar color:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿ELIMINAR ESTE REGISTRO CROMÁTICO DEL SISTEMA?")) {
      try {
        await deleteColor(id);
        cargarColores();
      } catch (error) {
        console.error("Error al eliminar color:", error);
      }
    }
  };

  // Función mágica para obtener el color de la bolita
  const getDynamicColor = (colorName: string) => {
    const upperName = colorName.toUpperCase().trim();
    return COLOR_MAP[upperName] || "linear-gradient(45deg, #ccc 25%, #eee 25%, #eee 50%, #ccc 50%, #ccc 75%, #eee 75%, #eee 100%)";
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* HEADER INDUSTRIAL */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '4px solid #000', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ColorIcon sx={{ fontSize: 50, color: '#000' }} />
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: '2.2rem', lineHeight: 1, letterSpacing: -1 }}>
              REGISTRO_<span style={{ color: "#3a7afe" }}>CROMÁTICO</span>
            </Typography>
            <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'text.secondary' }}>
              POSTGRESQL_DB // ATTRIBUTE_PALETTE
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => handleOpenModal()} 
          sx={{ borderRadius: 0, bgcolor: '#000', px: 4, py: 1.5, fontWeight: 900, '&:hover': { bgcolor: '#333' } }}
        >
          NUEVO_COLOR
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 0, border: '4px solid #000', boxShadow: '12px 12px 0px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#000' }}>
          <TextField 
            fullWidth 
            placeholder="FILTRAR_POR_NOMBRE_DE_COLOR..." 
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
            <TableHead sx={{ bgcolor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, borderRight: '1px solid #ddd' }}><Stack direction="row" spacing={1}><IDIcon fontSize="small"/><span>UUID_IDENTIFIER</span></Stack></TableCell>
                <TableCell sx={{ fontWeight: 900 }}>MUESTRA / NOMBRE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900 }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 10 }}><CircularProgress color="inherit" thickness={6} /></TableCell></TableRow>
              ) : colores.length === 0 ? (
                <TableRow><TableCell colSpan={3} align="center" sx={{ py: 10, fontWeight: 800 }}>SISTEMA_SIN_REGISTROS</TableCell></TableRow>
              ) : (
                colores.map((c) => (
                  <TableRow key={c.id_color} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary', borderRight: '1px solid #eee' }}>
                      {c.id_color}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        {/* LA BOLITA DINÁMICA */}
                        <Tooltip title={`Hex-Map: ${getDynamicColor(c.color)}`} arrow>
                          <Box sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            background: getDynamicColor(c.color),
                            border: '3px solid #000',
                            boxShadow: '3px 3px 0px rgba(0,0,0,0.2)',
                            flexShrink: 0
                          }} />
                        </Tooltip>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: 1 }}>
                          {c.color.toUpperCase()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        sx={{ border: '2px solid #000', borderRadius: 0, mr: 1, '&:hover': { bgcolor: '#000', color: '#fff' } }} 
                        onClick={() => handleOpenModal(c)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        sx={{ border: '2px solid #000', borderRadius: 0, '&:hover': { bgcolor: '#ef4444', color: '#fff', borderColor: '#ef4444' } }} 
                        onClick={() => handleDelete(c.id_color)}
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
          sx={{ bgcolor: '#f1f5f9', borderTop: '2px solid #000', fontWeight: 800 }}
        />
      </Paper>

      {/* MODAL DE COLOR */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 0, border: '4px solid #000' } }}
      >
        <DialogTitle sx={{ bgcolor: '#000', color: '#fff', fontWeight: 900 }}>
          {selectedColor ? "EDITAR_PARÁMETRO" : "NUEVO_PARÁMETRO"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            {/* Vista previa en el modal */}
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: getDynamicColor(form.color),
              border: '4px solid #000',
              mb: 2
            }} />
            
            <TextField 
              fullWidth 
              label="ETIQUETA_DEL_COLOR" 
              placeholder="EJ: AZUL MARINO" 
              value={form.color} 
              onChange={(e) => setForm({ color: e.target.value })} 
              slotProps={{ 
                input: { sx: { borderRadius: 0, fontWeight: 900, textAlign: 'center' } },
                formHelperText: { sx: { fontWeight: 700, fontFamily: 'monospace' } }
              }}
              helperText="EL SISTEMA ASIGNARÁ LA MUESTRA AUTOMÁTICAMENTE"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f1f5f9' }}>
          <Button onClick={() => setOpenModal(false)} sx={{ fontWeight: 900, color: '#000' }}>CANCELAR</Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={!form.color.trim()}
            sx={{ borderRadius: 0, bgcolor: '#000', fontWeight: 900, px: 4 }}
          >
            CONFIRMAR
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}