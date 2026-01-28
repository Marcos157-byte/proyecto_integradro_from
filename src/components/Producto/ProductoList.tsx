import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, Chip, IconButton, CircularProgress,
  Button, TablePagination 
} from "@mui/material";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditRounded as EditIcon
} from "@mui/icons-material";

import type { Producto } from "../../types/producto.types";
import StockStatusChip from "../dashboard/bodega/StockStatusChip";
import ModalEditarProducto from "./ModalEditarProducto";
import ModalCrearProducto from "./ModalCrearProducto";
import { createProducto, listProductos, updateProducto } from "../../services/productoService";

export default function ProductoList() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  const [openCrear, setOpenCrear] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [selectedProd, setSelectedProd] = useState<Producto | null>(null);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await listProductos(page + 1, rowsPerPage, search);
      setProductos(res.docs);
      setTotalDocs(res.totalDocs);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [page, rowsPerPage, search]);

  const handleSaveProduct = async (nuevo: any) => {
    try {
      await createProducto(nuevo);
      await cargarProductos(); // Recarga para traer objetos completos
      setOpenCrear(false);
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  const handleUpdateProduct = async (editado: any) => {
    if (selectedProd?.id_producto) {
      try {
        await updateProducto(selectedProd.id_producto, editado);
        // IMPORTANTE: Recargar desde el servidor asegura que las 
        // relaciones (nombres) vuelvan a venir como objetos.
        await cargarProductos(); 
        setOpenEditar(false);
      } catch (error) {
        console.error("Error al actualizar:", error);
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>Control de <span style={{ color: "#3a7afe" }}>Inventario</span></Typography>
          <Typography variant="body1" color="text.secondary">Datos reales desde Postgres y MongoDB.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCrear(true)} sx={{ borderRadius: 2 }}>
          Nuevo Producto
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <TextField 
            fullWidth 
            placeholder="Buscar por nombre..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} 
            sx={{ bgcolor: 'white' }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Producto</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Categoría / Talla</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
              ) : (
                productos.map((prod) => (
                  <TableRow key={prod.id_producto} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{prod.nombre}</Typography>
                      {/* CORRECCIÓN: Asegúrate de que la propiedad sea 'color' y no 'nombre_color' si es objeto */}
                      <Typography variant="caption" color="text.secondary">
                        {prod.color?.color || 'Sin color'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        {/* CORRECCIÓN: Acceso seguro al nombre de categoría y talla */}
                        <Chip 
                          label={prod.categoria?.nombre || 'N/A'} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={prod.talla?.nombre || 'N/A'} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 900 }}>{prod.stock_total}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <StockStatusChip stock={prod.stock_total} stockMinimo={5} />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton color="info" onClick={() => { setSelectedProd(prod); setOpenEditar(true); }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalDocs}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <ModalCrearProducto open={openCrear} onClose={() => setOpenCrear(false)} onSave={handleSaveProduct} />
      {selectedProd && (
        <ModalEditarProducto 
          open={openEditar} 
          producto={selectedProd} 
          onClose={() => setOpenEditar(false)} 
          onUpdate={handleUpdateProduct} 
        />
      )}
    </Box>
  );
}