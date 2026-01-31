import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, Chip, CircularProgress, Container, Stack 
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
      const res = await listProductos(1, 20, search); 
      setProductos(res?.docs || []);
    } catch (error) {
      console.error("Error consultando stock", error);
      setProductos([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      consultarStock();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* HEADER INDUSTRIAL */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box sx={{ p: 2, bgcolor: '#000', borderRadius: 0, color: 'white', display: 'flex', border: '2px solid #000' }}>
          <StockIcon fontSize="large" />
        </Box>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#000', letterSpacing: '-2px', textTransform: 'uppercase' }}>
            CONTROL_INVENTARIO
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#666', letterSpacing: 1 }}>
            CONSULTA_RÁPIDA_DE_EXISTENCIAS
          </Typography>
        </Box>
      </Box>

      {/* BUSCADOR ESTILO TÉCNICO */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 1, 
          borderRadius: 0, 
          border: '4px solid #000', 
          mb: 4, 
          bgcolor: '#fff' 
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="ESCRIBE_EL_NOMBRE_DEL_PRODUCTO..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ px: 2, py: 1 }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#000', mr: 1 }} />
              </InputAdornment>
            ),
            sx: { fontWeight: 900, fontFamily: 'monospace', fontSize: '1.1rem' }
          }}
        />
      </Paper>

      {/* TABLA DE RESULTADOS */}
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          borderRadius: 0, 
          border: '4px solid #000',
          bgcolor: '#fff'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#000" }}>
              <TableCell sx={{ fontWeight: 900, color: '#fff' }}>PRODUCTO</TableCell>
              <TableCell sx={{ fontWeight: 900, color: '#fff' }}>TALLA</TableCell>
              <TableCell sx={{ fontWeight: 900, color: '#fff' }}>CATEGORÍA</TableCell>
              <TableCell align="center" sx={{ fontWeight: 900, color: '#fff' }}>STOCK</TableCell>
              <TableCell align="center" sx={{ fontWeight: 900, color: '#fff' }}>ESTADO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <CircularProgress size={40} thickness={6} sx={{ color: '#000' }} />
                </TableCell>
              </TableRow>
            ) : productos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                  <Typography sx={{ fontWeight: 800, color: '#94a3b8' }}>
                    NO SE ENCONTRARON PRODUCTOS DISPONIBLES.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              productos.map((prod) => (
                <TableRow 
                  key={prod.id_producto} 
                  hover 
                  sx={{ borderBottom: '2px solid #eee' }}
                >
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#000', textTransform: 'uppercase' }}>
                      {prod.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#666' }}>
                      REF: {prod.id_producto.split('-')[0].toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'inline-block', 
                      p: '2px 8px', 
                      border: '1px solid #000', 
                      fontWeight: 900, 
                      fontFamily: 'monospace',
                      fontSize: '0.75rem'
                    }}>
                      {prod.talla?.nombre || 'N/A'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {prod.categoria?.nombre || 'GENERAL'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ 
                      fontWeight: 900, 
                      fontSize: '1.2rem', 
                      fontFamily: 'monospace',
                      color: prod.stock_total <= 0 ? '#ff0000' : '#000' 
                    }}>
                      {prod.stock_total}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {prod.stock_total <= 0 ? (
                      <Chip 
                        label="AGOTADO" 
                        sx={{ borderRadius: 0, bgcolor: '#fee2e2', color: '#ff0000', fontWeight: 900, border: '1px solid #ff0000', fontSize: '0.7rem' }} 
                      />
                    ) : prod.stock_total < 5 ? (
                      <Chip 
                        label="BAJO STOCK" 
                        sx={{ borderRadius: 0, bgcolor: '#fff7ed', color: '#9a3412', fontWeight: 900, border: '1px solid #9a3412', fontSize: '0.7rem' }} 
                      />
                    ) : (
                      <Chip 
                        label="DISPONIBLE" 
                        sx={{ borderRadius: 0, bgcolor: '#000', color: '#fff', fontWeight: 900, border: '1px solid #000', fontSize: '0.7rem' }} 
                      />
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