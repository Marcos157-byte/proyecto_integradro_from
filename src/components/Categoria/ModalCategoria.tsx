import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, CircularProgress, Alert 
} from "@mui/material";
import { createCategoria, updateCategoria } from "../../services/categoriaService";
import type { Categoria } from "../../types/categoria.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoria?: Categoria | null;
}

export default function ModalCategoria({ open, onClose, onSuccess, categoria }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });

  useEffect(() => {
    if (open) {
      setFormData({ 
        nombre: categoria?.nombre || "", 
        descripcion: categoria?.descripcion || "" 
      });
      setError(null);
    }
  }, [open, categoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (categoria?.id_categoria) {
        // Actualizar usando el UUID (id_categoria)
        await updateCategoria(categoria.id_categoria, formData);
      } else {
        // Crear nueva categoría
        await createCategoria(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {categoria ? "Editar Categoría" : "Nueva Categoría"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Nombre"
              fullWidth
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}   