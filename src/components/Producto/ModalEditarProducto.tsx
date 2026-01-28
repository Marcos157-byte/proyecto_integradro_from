import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Grid, TextField, MenuItem, CircularProgress, Box 
} from "@mui/material";

// Importaciones alineadas con los servicios que ya funcionan
import { getCategorias } from "../../services/categoriaService";
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
    stock_total: 0,
    id_categoria: "",
    id_talla: "",
    id_color: "",
    id_proveedor: ""
  });

  // 1. Cargar catálogos al abrir el modal
  useEffect(() => {
    if (open) {
      const cargarCatalogos = async () => {
        setLoading(true);
        try {
          const [catRes, talRes, colRes, provRes] = await Promise.all([
            getCategorias(1, 100), // Cambiado a getCategorias para consistencia
            getTallas(1, 100),
            listColores(),
            getProveedores({ limit: 100 })
          ]);

          setCategorias(catRes.data?.docs || []);
          setTallas(talRes.data?.docs || []);
          setColores(colRes || []); 
          setProveedores(provRes.data?.data || provRes.data || []);
        } catch (error) {
          console.error("Error cargando catálogos", error);
        } finally {
          setLoading(false);
        }
      };
      cargarCatalogos();
    }
  }, [open]);

  // 2. Sincronizar el formulario con el producto seleccionado
  useEffect(() => {
    if (producto && open) {
      setForm({
        nombre: producto.nombre || "",
        precio: producto.precio || 0,
        stock_total: producto.stock_total ?? 0,
        // Extraemos el ID ya sea del objeto poblado o del campo directo
        id_categoria: producto.categoria?.id_categoria || producto.id_categoria || "", 
        id_talla: producto.talla?.id_talla || producto.id_talla || "",
        id_color: producto.color?.id_color || producto.id_color || "",
        id_proveedor: producto.proveedor?.id_proveedor || producto.id_proveedor || ""
      });
    }
  }, [producto, open]);

  const handleUpdate = () => {
    // Limpieza de datos antes de enviar
    const dataLimpia = {
      ...form,
      precio: Number(String(form.precio).replace(',', '.')),
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
            <Grid size={{ xs: 12 }}>
              <TextField 
                label="Nombre del Producto" 
                fullWidth 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value})} 
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField 
                label="Precio ($)" 
                fullWidth 
                value={form.precio}
                onChange={(e) => setForm({...form, precio: e.target.value})} 
                helperText="Use punto para decimales"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField 
                label="Stock Actual" 
                fullWidth 
                disabled 
                value={form.stock_total}
                variant="filled"
                helperText="El stock se gestiona vía inventario"
              />
            </Grid>

            {/* Select Categoría (Mongo) */}
            <Grid size={{ xs: 6 }}>
              <TextField select label="Categoría" fullWidth value={form.id_categoria}
                onChange={(e) => setForm({...form, id_categoria: e.target.value})}>
                {categorias.map((c) => (
                  <MenuItem key={c.id_categoria} value={c.id_categoria}>{c.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select Talla (Mongo) */}
            <Grid size={{ xs: 6 }}>
              <TextField select label="Talla" fullWidth value={form.id_talla}
                onChange={(e) => setForm({...form, id_talla: e.target.value})}>
                {tallas.map((t) => (
                  <MenuItem key={t.id_talla} value={t.id_talla}>{t.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select Color (Postgres) */}
            <Grid size={{ xs: 6 }}>
              <TextField select label="Color" fullWidth value={form.id_color}
                onChange={(e) => setForm({...form, id_color: e.target.value})}>
                {colores.map((col) => (
                  <MenuItem key={col.id_color} value={col.id_color}>{col.color}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select Proveedor (Postgres) */}
            <Grid size={{ xs: 6}}>
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

      <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
        <Button onClick={onClose} color="inherit" variant="outlined">Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={handleUpdate} 
          disabled={loading || !form.nombre || !form.id_categoria}
          sx={{ fontWeight: 700, px: 3 }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}