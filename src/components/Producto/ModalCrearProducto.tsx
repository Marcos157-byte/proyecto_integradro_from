import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Grid, TextField, MenuItem, CircularProgress, Box 
} from "@mui/material";
import { listCategorias } from "../../services/categoriaService";
import { getTallas } from "../../services/tallaService";
import { listColores } from "../../services/colorService";
import { getProveedores } from "../../services/proveedorService";

// Importaciones corregidas con rutas relativas a src/services


export default function ModalCrearProducto({ open, onClose, onSave }: any) {
  const [loading, setLoading] = useState(false);
  
  const [categorias, setCategorias] = useState<any[]>([]);
  const [tallas, setTallas] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  const [form, setForm] = useState({ 
    nombre: "", 
    precio: 0,
    stock_total: 0, 
    id_categoria: "", 
    id_talla: "",     
    id_color: "",     
    id_proveedor: "", 
    activo: true
  });

  useEffect(() => {
    if (open) {
      const cargarOpciones = async () => {
        setLoading(true);
        try {
          // 1. Ejecutamos todas las funciones (Nota los paréntesis en todas)
          const [catRes, talRes, colRes, provRes] = await Promise.all([
            listCategorias({ limit: 100 }), // Mongo
            getTallas(1, 100),             // Mongo
            listColores(),                 // Postgres
            getProveedores({ limit: 100 })  // Postgres
          ]);

          // 2. Extracción segura de datos según el origen (Mongo usa .docs, Postgres usa .data)
          setCategorias(catRes.data?.docs || []);
          setTallas(talRes.data?.docs || []);
          setColores(colRes || []); // listColores ya devuelve el array limpio
          setProveedores(provRes.data?.data || []);
          
        } catch (error) {
          console.error("Error cargando opciones:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarOpciones();
    }
  }, [open]);

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>
        📦 Registrar Nuevo Producto
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField label="Nombre del Producto" fullWidth value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value})} />
            </Grid>

            <Grid item xs={6}>
              <TextField label="Precio ($)" type="number" fullWidth value={form.precio}
                onChange={(e) => setForm({...form, precio: Number(e.target.value)})} />
            </Grid>

            <Grid item xs={6}>
              <TextField label="Stock Inicial" type="number" fullWidth value={form.stock_total}
                onChange={(e) => setForm({...form, stock_total: Number(e.target.value)})} />
            </Grid>

            {/* Select Categoría */}
            <Grid item xs={6}>
              <TextField select label="Categoría" fullWidth value={form.id_categoria}
                onChange={(e) => setForm({...form, id_categoria: e.target.value})}>
                {categorias.map((c) => (
                  <MenuItem key={c.id_categoria} value={c.id_categoria}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select Talla */}
            <Grid item xs={6}>
              <TextField select label="Talla" fullWidth value={form.id_talla}
                onChange={(e) => setForm({...form, id_talla: e.target.value})}>
                {tallas.map((t) => (
                  <MenuItem key={t.id_talla} value={t.id_talla}>{t.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select Color */}
            <Grid item xs={6}>
              <TextField select label="Color" fullWidth value={form.id_color}
                onChange={(e) => setForm({...form, id_color: e.target.value})}>
                {colores.map((col) => (
                  <MenuItem key={col.id_color} value={col.id_color}>{col.color}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select Proveedor */}
            <Grid item xs={6}>
              <TextField select label="Proveedor" fullWidth value={form.id_proveedor}
                onChange={(e) => setForm({...form, id_proveedor: e.target.value})}>
                {proveedores.map((p) => (
                  <MenuItem key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={loading || !form.nombre || !form.id_categoria || !form.id_talla}
        >
          Guardar Producto
        </Button>
      </DialogActions>
    </Dialog>
  );
}