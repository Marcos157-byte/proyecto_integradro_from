import { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, CircularProgress, Alert, Divider, Stack 
} from "@mui/material";
import { 
  EditNote as EditIcon, 
  AddBox as AddIcon} from "@mui/icons-material";
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
        await updateCategoria(categoria.id_categoria, formData);
      } else {
        await createCategoria(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "ERROR_SISTEMA: FALLO AL PROCESAR SOLICITUD");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 0,
          border: '4px solid #000',
          boxShadow: 'none'
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* TÍTULO CON ESTILO DE CABECERA TÉCNICA */}
        <DialogTitle 
          sx={{ 
            bgcolor: '#000', 
            color: '#fff', 
            fontWeight: 900, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            py: 2
          }}
        >
          {categoria ? <EditIcon /> : <AddIcon />}
          <span style={{ letterSpacing: '1px' }}>
            {categoria ? "MODIFICAR_CATEGORÍA" : "NUEVA_CATEGORÍA"}
          </span>
        </DialogTitle>

        <DialogContent sx={{ p: 3, mt: 1 }}>
          <Stack spacing={3}>
            {error && (
              <Alert 
                severity="error" 
                variant="filled" 
                sx={{ borderRadius: 0, fontWeight: 700, border: '1px solid #000' }}
              >
                {error.toUpperCase()}
              </Alert>
            )}

            <TextField
              label="ETIQUETA_NOMBRE"
              fullWidth
              required
              placeholder="EJ: TEXTILES_PREMIUM"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value.toUpperCase() })}
              slotProps={{
                input: { sx: { borderRadius: 0, fontWeight: 800 } },
                inputLabel: { sx: { fontWeight: 700 } }
              }}
            />

            <TextField
              label="DESCRIPCIÓN_TÉCNICA"
              fullWidth
              multiline
              rows={3}
              required
              placeholder="DEFINICIÓN DEL SEGMENTO DE PRODUCTOS..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value.toUpperCase() })}
              slotProps={{
                input: { sx: { borderRadius: 0, fontWeight: 600 } },
                inputLabel: { sx: { fontWeight: 700 } }
              }}
            />
          </Stack>
        </DialogContent>

        <Divider sx={{ borderBottomWidth: 2, borderColor: '#000' }} />

        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button 
            onClick={onClose} 
            sx={{ 
              fontWeight: 900, 
              color: '#000',
              '&:hover': { textDecoration: 'underline' } 
            }}
          >
            CANCELAR
          </Button>
          
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ 
              borderRadius: 0, 
              bgcolor: '#000', 
              px: 4,
              fontWeight: 900,
              boxShadow: '4px 4px 0px #3a7afe', // Sombra de acento azul
              '&:hover': { 
                bgcolor: '#333',
                boxShadow: '2px 2px 0px #3a7afe',
                transform: 'translate(2px, 2px)'
              },
              '&.Mui-disabled': {
                bgcolor: '#ccc'
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "GUARDAR_CAMBIOS"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}