import { useState, useEffect } from "react";
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
      // Usamos el servicio que definiste: listProductos(page, limit, search)
      const res = await listProductos(1, 20, search); 
      // Validamos que res y res.docs existan antes de setear
      setProductos(res?.docs || []);
    } catch (error) {
      console.error("Error consultando stock", error);
      setProductos([]); // Limpiamos en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si el usuario borra todo, cargamos la lista inicial
    const timer = setTimeout(() => {
      consultarStock();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* Encabezado con tu estilo oscuro */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box sx={{ p: 1.5, bgcolor: '#0f172a', borderRadius: 3, color: 'white', display: 'flex' }}>
          <StockIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Control de Inventario
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta rápida de existencias y disponibilidad por nombre.
          </Typography>
        </Box>
      </Box>

      {/* Buscador Estilo Moderno */}
      <Paper elevation={0} sx={{ p: 1, borderRadius: 4, border: '1px solid #e2e8f0', mb: 3, bgcolor: 'white' }}>
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
                  No se encontraron productos disponibles.
                </TableCell>
              </TableRow>
            ) : (
              productos.map((prod) => (
                <TableRow key={prod.id_producto} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {prod.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ref: {prod.id_producto.split('-')[0].toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={prod.talla?.nombre || 'N/A'} 
                      size="small" 
                      sx={{ fontWeight: 600, bgcolor: '#f1f5f9', color: '#475569' }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="#475569">
                      {prod.categoria?.nombre || 'General'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: prod.stock_total <= 0 ? '#ef4444' : '#0f172a' }}>
                      {prod.stock_total}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {prod.stock_total <= 0 ? (
                      <Chip label="Agotado" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: '0.7rem' }} />
                    ) : prod.stock_total < 5 ? (
                      <Chip label="Bajo Stock" sx={{ bgcolor: '#ffedd5', color: '#9a3412', fontWeight: 700, fontSize: '0.7rem' }} />
                    ) : (
                      <Chip label="Disponible" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.7rem' }} />
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