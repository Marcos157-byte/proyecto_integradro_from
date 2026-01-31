import { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem, Typography, Divider, Stack
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { AddBox as AddIcon, Close as CloseIcon } from "@mui/icons-material";

export default function ProductoCreateModal({ open, onClose, onSave }: any) {
  const [nuevoProd, setNuevoProd] = useState({
    nombre: "",
    codigo_sku: "",
    categoria: "Caballero",
    talla: "32",
    precio: 0,         // Campo añadido
    stock_actual: 0,
    stock_minimo: 5,
    activo: true,
    fecha_creacion: new Date().toLocaleDateString()
  });

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;

    // VALIDACIÓN: Impedir que se guarden números negativos
    if (type === 'number' && parseFloat(value) < 0) {
      return; 
    }

    setNuevoProd({ ...nuevoProd, [name]: value });
  };

  const handleGuardar = () => {
    const productoCompleto = { ...nuevoProd, id_producto: Math.random() };
    onSave(productoCompleto);
    onClose();
    setNuevoProd({ 
      nombre: "", codigo_sku: "", categoria: "Caballero", 
      talla: "32", precio: 0, stock_actual: 0, stock_minimo: 5, 
      activo: true, fecha_creacion: new Date().toLocaleDateString() 
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 0, border: '4px solid #000', boxShadow: 'none' }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#000', color: '#fff', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AddIcon />
        <Typography sx={{ fontWeight: 900, letterSpacing: 1 }}>
          NUEVA_ENTRADA_INVENTARIO
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Typography variant="caption" sx={{ fontWeight: 900, color: '#999', mb: 3, display: 'block' }}>
          REGISTRO_SISTEMA: {nuevoProd.fecha_creacion}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField 
              label="NOMBRE_PRODUCTO" 
              name="nombre" 
              fullWidth 
              onChange={handleChange}
              InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}
              InputLabelProps={{ sx: { fontWeight: 900, color: '#000' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField 
              label="SKU_CODE" 
              name="codigo_sku" 
              fullWidth 
              onChange={handleChange} 
              inputProps={{ style: { fontFamily: 'monospace', fontWeight: 900 } }}
              InputProps={{ sx: { borderRadius: 0 } }}
              InputLabelProps={{ sx: { fontWeight: 900, color: '#000' } }}
            />
          </Grid>
          
          {/* PRECIO CON VALIDACIÓN DE MÍNIMO */}
          <Grid size={{ xs: 12 }}>
            <TextField 
              label="PRECIO_UNITARIO ($)" 
              name="precio" 
              type="number" 
              fullWidth 
              value={nuevoProd.precio}
              onChange={handleChange}
              slotProps={{ htmlInput: { min: 0, step: "0.01" } }} // Atributo HTML para evitar negativos
              InputProps={{ 
                sx: { borderRadius: 0, fontWeight: 900, fontFamily: 'monospace', bgcolor: '#fffbed' } 
              }}
              InputLabelProps={{ sx: { fontWeight: 900, color: '#000' } }}
              helperText="EL PRECIO NO PUEDE SER INFERIOR A 0.00"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label="CATEGORÍA" name="categoria" fullWidth value={nuevoProd.categoria} onChange={handleChange} InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}>
              <MenuItem value="Caballero">CABALLERO</MenuItem>
              <MenuItem value="Dama">DAMA</MenuItem>
              <MenuItem value="Niños">NIÑOS</MenuItem>
            </TextField>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select label="TALLA" name="talla" fullWidth value={nuevoProd.talla} onChange={handleChange} InputProps={{ sx: { borderRadius: 0, fontWeight: 700 } }}>
              <MenuItem value="28">28</MenuItem>
              <MenuItem value="30">30</MenuItem>
              <MenuItem value="32">32</MenuItem>
              <MenuItem value="34">34</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12}><Divider sx={{ borderBottomWidth: 2, borderColor: '#000' }} /></Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="STOCK_INICIAL" 
              name="stock_actual" 
              type="number" 
              fullWidth 
              value={nuevoProd.stock_actual}
              onChange={handleChange}
              slotProps={{ htmlInput: { min: 0 } }} 
              InputProps={{ sx: { borderRadius: 0, fontWeight: 900, fontFamily: 'monospace' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="ALERTA_MÍNIMA" 
              name="stock_minimo" 
              type="number" 
              fullWidth 
              value={nuevoProd.stock_minimo}
              onChange={handleChange} 
              slotProps={{ htmlInput: { min: 1 } }}
              InputProps={{ sx: { borderRadius: 0, fontWeight: 900, fontFamily: 'monospace' } }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '2px solid #eee' }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button fullWidth onClick={onClose} variant="outlined" startIcon={<CloseIcon />} sx={{ borderRadius: 0, border: '2px solid #000', color: '#000', fontWeight: 900 }}>
            CANCELAR
          </Button>
          <Button 
            fullWidth variant="contained" onClick={handleGuardar} 
            disabled={!nuevoProd.nombre || !nuevoProd.codigo_sku || nuevoProd.precio <= 0}
            sx={{ borderRadius: 0, bgcolor: '#000', fontWeight: 900, border: '2px solid #000', '&:hover': { bgcolor: '#333' } }}
          >
            CONFIRMAR_REGISTRO
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}