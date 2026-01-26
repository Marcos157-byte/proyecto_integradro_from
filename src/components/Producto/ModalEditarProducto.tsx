import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Grid, TextField, MenuItem, CircularProgress, Box 
} from "@mui/material";
import { listCategorias } from "../../services/categoriaService";
import { getTallas } from "../../services/tallaService";
import { listColores } from "../../services/colorService";
import { getProveedores } from "../../services/proveedorService";

export default function ModalEditarProducto({ open, onClose, producto, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  
  const [categorias, setCategorias] = useState<any[]>([]);
  const [tallas, setTallas] = useState<any[]>([]);
  const [colores, setColores] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  const [form, setForm] = useState<any>({
    nombre: "",
    precio: 0,
    stock_total: 0, // <-- AGREGADO: Para persistir el valor actual
    id_categoria: "",
    id_talla: "",
    id_color: "",
    id_proveedor: ""
  });

  useEffect(() => {
    if (open) {
      const cargarCatalogos = async () => {
        setLoading(true);
        try {
          const [catRes, talRes, colRes, provRes] = await Promise.all([
            listCategorias({ limit: 100 }),
            getTallas(1, 100),
            listColores(),
            getProveedores({ limit: 100 })
          ]);

          setCategorias(catRes.data?.docs || []);
          setTallas(talRes.data?.docs || []);
          setColores(colRes || []); 
          setProveedores(provRes.data?.data || []);
        } catch (error) {
          console.error("Error cargando catálogos", error);
        } finally {
          setLoading(false);
        }
      };
      cargarCatalogos();
    }
  }, [open]);

  useEffect(() => {
    if (producto && open) {
      setForm({
        nombre: producto.nombre || "",
        precio: producto.precio || 0,
        stock_total: producto.stock_total ?? 0, // <-- IMPORTANTE: Rescatamos el stock actual del producto
        id_categoria: producto.categoria?.id_categoria || producto.id_categoria || "", 
        id_talla: producto.talla?.id_talla || producto.id_talla || "",
        id_color: producto.color?.id_color || "",
        id_proveedor: producto.proveedor?.id_proveedor || ""
      });
    }
  }, [producto, open]);

  const handleUpdate = () => {
    const dataLimpia = {
      ...form,
      precio: Number(String(form.precio).replace(',', '.')),
      // Aseguramos que stock_total viaje como número para que el backend no lo ignore
      stock_total: Number(form.stock_total) 
    };

    if (isNaN(dataLimpia.precio)) {
        alert("Por favor, ingrese un precio válido");
        return;
    }

    onUpdate(dataLimpia);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>✏️ Editar Producto</DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                label="Nombre del Producto" 
                fullWidth 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value})} 
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label="Precio ($)" 
                fullWidth 
                value={form.precio}
                onChange={(e) => setForm({...form, precio: e.target.value})} 
                helperText="Use punto para decimales (ej: 43.00)"
              />
            </Grid>

            {/* Campo Informativo de Stock (Opcional - solo lectura) */}
            <Grid item xs={12}>
              <TextField 
                label="Stock Actual (No editable desde aquí)" 
                fullWidth 
                disabled 
                value={form.stock_total}
                variant="filled"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField select label="Categoría" fullWidth value={form.id_categoria}
                onChange={(e) => setForm({...form, id_categoria: e.target.value})}>
                {categorias.map((c) => (
                  <MenuItem key={c.id_categoria} value={c.id_categoria}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select label="Talla" fullWidth value={form.id_talla}
                onChange={(e) => setForm({...form, id_talla: e.target.value})}>
                {tallas.map((t) => (
                  <MenuItem key={t.id_talla} value={t.id_talla}>{t.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select label="Color" fullWidth value={form.id_color}
                onChange={(e) => setForm({...form, id_color: e.target.value})}>
                {colores.map((col) => (
                  <MenuItem key={col.id_color} value={col.id_color}>{col.color}</MenuItem>
                ))}
              </TextField>
            </Grid>

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
          onClick={handleUpdate} 
          color="primary" 
          disabled={loading || !form.nombre}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}