import { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, CircularProgress 
} from "@mui/material";



interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para recargar la tabla al terminar
}

export default function ModalCategoria({ open, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await categoriaService.create(formData);
      if (response.success) {
        setFormData({ nombre: "", descripcion: "" }); // Limpiar
        onSuccess(); // Avisar al padre que recargue la lista
        onClose();   // Cerrar modal
      }
    } catch (error) {
      console.error("Error al crear categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>Nueva Categoría</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Nombre de la categoría"
              fullWidth
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              inputProps={{ maxLength: 100 }}
              placeholder="Ej: Skinny Jeans"
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe qué tipos de jeans incluye esta categoría..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ bgcolor: "#3a7afe", fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar Categoría"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}