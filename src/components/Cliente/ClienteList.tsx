import { useState, useEffect } from "react";
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, InputAdornment,
    IconButton, Dialog, DialogTitle, DialogContent, CircularProgress
} from "@mui/material";
import {
    AddRounded as AddIcon,
    SearchRounded as SearchIcon,
    EditRounded as EditIcon,
    PersonAddRounded as PersonIcon
} from "@mui/icons-material";
import { listClientes } from "../../services/clienteService";
import ClienteForm from "./ClienteForm";
import type { Cliente } from "../../types/cliente.dto";

export default function ClienteList() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);

    const cargarClientes = async () => {
        setLoading(true);
        try {
            // Petición al backend usando el término de búsqueda
            const res = await listClientes(1, 10, search);

            // CORRECCIÓN: Acceso directo a .docs para evitar error de propiedad inexistente
            // Si tu backend devuelve SuccessResponseDto con data: { docs, total }, usa res.data.docs
            // Esta versión es más robusta y evita que TypeScript se queje
            const dataDocs = (res as any).docs || (res as any).data?.docs || [];
            setClientes(dataDocs);
        } catch (error) {
            console.error("Error al cargar clientes", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce para optimizar la búsqueda
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            cargarClientes();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <Box sx={{ p: 4 }}>
            {/* Cabecera */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>
                        Directorio de <span style={{ color: "#1976d2" }}>Clientes</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Administra y visualiza la información de tus compradores.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenModal(true)}
                    sx={{
                        borderRadius: 3, px: 3, py: 1.5,
                        bgcolor: "#0f172a", textTransform: "none",
                        fontWeight: "bold", "&:hover": { bgcolor: "#1e293b" }
                    }}
                >
                    Nuevo Cliente
                </Button>
            </Box>

            {/* Buscador */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: "1px solid #e2e8f0", mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Buscar por nombre o identificación..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#94a3b8", ml: 1 }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Tabla Corregida para evitar Hydration Error (Eliminación de espacios entre nodos) */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: "1px solid #e2e8f0" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>NOMBRE / RAZÓN SOCIAL</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>IDENTIFICACIÓN</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>TELÉFONO</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>CORREO</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: "#64748b" }}>ACCIONES</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <CircularProgress size={40} thickness={4} sx={{ color: "#0f172a" }} />
                                </TableCell>
                            </TableRow>
                        ) : clientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10, color: "#94a3b8" }}>
                                    No se encontraron clientes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clientes.map((cli) => (
                                <TableRow key={cli.id_cliente} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{cli.nombre}</TableCell>
                                    <TableCell>{cli.cedula || "---"}</TableCell>
                                    <TableCell>{cli.telefono || "---"}</TableCell>
                                    <TableCell>{cli.email || "---"}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" size="small" sx={{ bgcolor: "#eff6ff" }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal */}
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 900, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ bgcolor: "#eff6ff", p: 1, borderRadius: 2, display: "flex" }}>
                        <PersonIcon color="primary" />
                    </Box>
                    Registrar Nuevo Cliente
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <ClienteForm
                            onSuccess={() => {
                                setOpenModal(false);
                                cargarClientes();
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}