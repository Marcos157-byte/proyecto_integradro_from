import { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography, Box 
} from "@mui/material";

interface Props {
  open: boolean;
  producto: any;
  onClose: () => void;
  onConfirm: (id: number, cantidad: number) => void;
}

export default function ModalAjusteStock({ open, producto, onClose, onConfirm }: Props) {
  const [cantidad, setCantidad] = useState<number>(0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Ajustar Inventario</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Producto: <strong>{producto?.nombre}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Stock actual: <strong>{producto?.stock_actual} unidades</strong>
          </Typography>

          <TextField
            label="Cantidad a sumar/restar"
            type="number"
            fullWidth
            helperText="Usa números positivos para entradas y negativos para salidas."
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button 
          variant="contained" 
          onClick={() => onConfirm(producto.id_producto, cantidad)}
          disabled={cantidad === 0}
        >
          Confirmar Ajuste
        </Button>
      </DialogActions>
    </Dialog>
  );
}