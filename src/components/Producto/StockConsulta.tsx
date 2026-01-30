import  { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, Chip, CircularProgress, Container 
} from "@mui/material";
import { SearchRounded as SearchIcon, Inventory2Rounded as StockIcon } from "@mui/icons-material";
import { listProductos } from "../../services/productoService";
import type { Producto } from "../../types/producto.types";

export default function StockConsulta() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const consultarStock = async () => {
    setLoading(true);
    try {
      // Llamamos a tu servicio con el texto de búsqueda
      const res = await listProductos(1, 20, search); 
      setProductos(res.docs);
    } catch (error) {
      console.error("Error consultando stock", error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar automáticamente cuando cambia el texto (espera 500ms tras dejar de escribir)
  useEffect(() => {
    const timer = setTimeout(() => {
      consultarStock();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box sx={{ p: 1.5, bgcolor: '#0f172a', borderRadius: 3, color: 'white', display: 'flex' }}>
          <StockIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a' }}>
            Control de Inventario
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta rápida de existencias por nombre de producto.
          </Typography>
        </Box>
      </Box>

      {/* Buscador */}
      <Paper elevation={0} sx={{ p: 1, borderRadius: 4, border: '1px solid #e2e8f0', mb: 3 }}>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Escribe el nombre del producto (ej: Jeans Slim Fit)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ px: 2, py: 1 }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Tabla de Resultados */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>PRODUCTO</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>TALLA</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>CATEGORÍA</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#64748b' }}>STOCK</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: '#64748b' }}>ESTADO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={40} thickness={4} sx={{ color: '#0f172a' }} />
                </TableCell>
              </TableRow>
            ) : productos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#94a3b8' }}>
                  No se encontraron productos con ese nombre.
                </TableCell>
              </TableRow>
            ) : (
              productos.map((prod) => (
                <TableRow key={prod.id_producto} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{prod.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">Ref: {prod.id_producto.split('-')[0]}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={prod.talla?.nombre || 'N/A'} size="small" sx={{ fontWeight: 600, bgcolor: '#f1f5f9' }} />
                  </TableCell>
                  <TableCell>{prod.categoria?.nombre || 'General'}</TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>
                      {prod.stock_total}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {prod.stock_total <= 0 ? (
                      <Chip label="Agotado" sx={{ bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 700 }} />
                    ) : prod.stock_total < 5 ? (
                      <Chip label="Stock Bajo" sx={{ bgcolor: '#ffedd5', color: '#f97316', fontWeight: 700 }} />
                    ) : (
                      <Chip label="En Stock" sx={{ bgcolor: '#dcfce7', color: '#22c55e', fontWeight: 700 }} />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}