import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, 
  InputAdornment, IconButton, CircularProgress,
  Button, TablePagination} from "@mui/material";
import { 
  SearchRounded as SearchIcon, 
  AddRounded as AddIcon,
  EditRounded as EditIcon,
  Inventory2 as InventoryIcon
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
      await cargarProductos();
      setOpenCrear(false);
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  const handleUpdateProduct = async (editado: any) => {
    if (selectedProd?.id_producto) {
      try {
        await updateProducto(selectedProd.id_producto, editado);
        await cargarProductos(); 
        setOpenEditar(false);
      } catch (error) {
        console.error("Error al actualizar:", error);
      }
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f1f1f1', minHeight: '100vh' }}>
      {/* HEADER INDUSTRIAL */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <InventoryIcon sx={{ fontSize: 35 }} />
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -2, textTransform: 'uppercase' }}>
              MASTER_INVENTORY
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#666', fontFamily: 'monospace' }}>
            SISTEMA DE GESTIÓN CENTRALIZADO // POSTGRES_DB
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpenCrear(true)} 
          sx={{ 
            borderRadius: 0, 
            bgcolor: '#000', 
            fontWeight: 900,
            px: 3,
            py: 1.5,
            border: '2px solid #000',
            '&:hover': { bgcolor: '#333' }
          }}
        >
          NUEVO_PRODUCTO
        </Button>
      </Box>

      {/* CONTENEDOR DE TABLA ESTILO FICHA */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 0, 
          border: '4px solid #000', 
          overflow: 'hidden' 
        }}
      >
        {/* BUSCADOR */}
        <Box sx={{ p: 3, bgcolor: '#fff', borderBottom: '4px solid #000' }}>
          <TextField 
            fullWidth 
            placeholder="FILTRAR_POR_NOMBRE_O_REFERENCIA..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#000' }} /></InputAdornment>,
              sx: { borderRadius: 0, fontWeight: 800, fontFamily: 'monospace' }
            }} 
            variant="outlined"
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#000" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, color: '#fff' }}>DESCRIPCIÓN_ITEM</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, color: '#fff' }}>CAT / TALLA</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, color: '#fff' }}>STOCK_QTY</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, color: '#fff' }}>ESTADO_LOG</TableCell>
                <TableCell align="right" sx={{ fontWeight: 900, color: '#fff' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: '#fff' }}>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress color="inherit" thickness={6} />
                  </TableCell>
                </TableRow>
              ) : (
                productos.map((prod) => (
                  <TableRow key={prod.id_producto} hover sx={{ '&:hover': { bgcolor: '#f9f9f9' }, borderBottom: '2px solid #eee' }}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                        {prod.nombre}
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#666' }}>
                        COLOR: {prod.color?.color?.toUpperCase() || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Box sx={{ px: 1, border: '1px solid #000', fontSize: '0.7rem', fontWeight: 900 }}>
                          {prod.categoria?.nombre?.toUpperCase() || 'N/A'}
                        </Box>
                        <Box sx={{ px: 1, bgcolor: '#000', color: '#fff', fontSize: '0.7rem', fontWeight: 900 }}>
                          {prod.talla?.nombre || 'N/A'}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', fontFamily: 'monospace' }}>
                        {prod.stock_total.toString().padStart(2, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <StockStatusChip stock={prod.stock_total} stockMinimo={5} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={() => { setSelectedProd(prod); setOpenEditar(true); }}
                        sx={{ 
                          borderRadius: 0, 
                          border: '2px solid #000', 
                          color: '#000',
                          '&:hover': { bgcolor: '#000', color: '#fff' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
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
          sx={{ bgcolor: '#fff', borderTop: '4px solid #000', fontWeight: 800 }}
        />
      </Paper>

      {/* MODALES */}
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