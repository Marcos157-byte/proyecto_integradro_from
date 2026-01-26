// src/components/Producto/ProductoCreateModal.tsx
import { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Grid, MenuItem 
} from "@mui/material";

export default function ProductoCreateModal({ open, onClose, onSave }: any) {
  const [nuevoProd, setNuevoProd] = useState({
    nombre: "",
    codigo_sku: "",
    categoria: "Caballero", // Valor inicial simulado
    talla: "32",            // Valor inicial simulado
    stock_actual: 0,
    stock_minimo: 5,
    activo: true,
    fecha_creacion: new Date().toLocaleDateString()
  });

  const handleChange = (e: any) => {
    setNuevoProd({ ...nuevoProd, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    // Le asignamos un ID falso para la simulación
    const productoCompleto = { ...nuevoProd, id_producto: Math.random() };
    onSave(productoCompleto);
    onClose();
    // Limpiamos el formulario
    setNuevoProd({ nombre: "", codigo_sku: "", categoria: "Caballero", talla: "32", stock_actual: 0, stock_minimo: 5, activo: true, fecha_creacion: new Date().toLocaleDateString() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>📦 Registrar Nuevo Producto</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={8}>
            <TextField label="Nombre del Producto" name="nombre" fullWidth onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="SKU / Código" name="codigo_sku" fullWidth onChange={handleChange} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField select label="Categoría" name="categoria" fullWidth value={nuevoProd.categoria} onChange={handleChange}>
              <MenuItem value="Caballero">Caballero</MenuItem>
              <MenuItem value="Dama">Dama</MenuItem>
              <MenuItem value="Niños">Niños</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField select label="Talla" name="talla" fullWidth value={nuevoProd.talla} onChange={handleChange}>
              <MenuItem value="28">28</MenuItem>
              <MenuItem value="30">30</MenuItem>
              <MenuItem value="32">32</MenuItem>
              <MenuItem value="34">34</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Stock Inicial" name="stock_actual" type="number" fullWidth onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Alerta Stock Mínimo" name="stock_minimo" type="number" fullWidth defaultValue={5} onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button variant="contained" onClick={handleGuardar} disabled={!nuevoProd.nombre || !nuevoProd.codigo_sku}>
          Crear Producto
        </Button>
      </DialogActions>
    </Dialog>
  );
}