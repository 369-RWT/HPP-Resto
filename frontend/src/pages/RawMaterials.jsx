import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Chip,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import api from '../services/api';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

export default function RawMaterials() {
    const [materials, setMaterials] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [deletingMaterial, setDeletingMaterial] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        category: '',
        unit: 'kg',
        currentPrice: 0,
        yieldPercentage: 100,
        supplierId: null,
        notes: '',
        isActive: true,
    });

    useEffect(() => {
        loadMaterials();
        loadSuppliers();
    }, [pagination.page, pagination.limit, searchTerm]);

    const loadMaterials = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/materials', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    search: searchTerm,
                },
            });
            setMaterials(data.data);
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total,
            }));
        } catch (error) {
            console.error('Failed to load materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSuppliers = async () => {
        try {
            const { data } = await api.get('/suppliers', {
                params: { limit: 100, isActive: true },
            });
            setSuppliers(data.data);
        } catch (error) {
            console.error('Failed to load suppliers:', error);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage, newLimit) => {
        setPagination(prev => ({
            ...prev,
            page: newPage,
            ...(newLimit && { limit: newLimit }),
        }));
    };

    const handleOpenDialog = (material = null) => {
        if (material) {
            setEditingMaterial(material);
            setFormData({
                code: material.code || '',
                name: material.name || '',
                category: material.category || '',
                unit: material.unit || 'kg',
                currentPrice: material.currentPrice || 0,
                yieldPercentage: material.yieldPercentage || 100,
                supplierId: material.supplierId || null,
                notes: material.notes || '',
                isActive: material.isActive,
            });
        } else {
            setEditingMaterial(null);
            setFormData({
                code: '',
                name: '',
                category: '',
                unit: 'kg',
                currentPrice: 0,
                yieldPercentage: 100,
                supplierId: null,
                notes: '',
                isActive: true,
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingMaterial(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['currentPrice', 'yieldPercentage', 'supplierId'].includes(name)
                ? (value === '' ? null : Number(value))
                : value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (editingMaterial) {
                await api.put(`/materials/${editingMaterial.id}`, formData);
            } else {
                await api.post('/materials', formData);
            }
            handleCloseDialog();
            loadMaterials();
        } catch (error) {
            console.error('Failed to save material:', error);
            alert(error.response?.data?.error || 'Failed to save material');
        }
    };

    const handleOpenDeleteDialog = (material) => {
        setDeletingMaterial(material);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeletingMaterial(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/materials/${deletingMaterial.id}`);
            handleCloseDeleteDialog();
            loadMaterials();
        } catch (error) {
            console.error('Failed to delete material:', error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const columns = [
        {
            id: 'code',
            label: 'Code',
            render: (row) => (
                <Typography variant="body2" fontWeight={600}>
                    {row.code}
                </Typography>
            ),
        },
        {
            id: 'name',
            label: 'Name',
            render: (row) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>
                        {row.name}
                    </Typography>
                    {row.category && (
                        <Typography variant="caption" color="text.secondary">
                            {row.category}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            id: 'unit',
            label: 'Unit',
            render: (row) => (
                <Typography variant="body2">{row.unit}</Typography>
            ),
        },
        {
            id: 'price',
            label: 'Price',
            render: (row) => (
                <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(row.currentPrice)}/{row.unit}
                </Typography>
            ),
        },
        {
            id: 'supplier',
            label: 'Supplier',
            render: (row) => (
                <Typography variant="body2" color="text.secondary">
                    {row.supplier?.name || '-'}
                </Typography>
            ),
        },
        {
            id: 'yield',
            label: 'Yield',
            render: (row) => (
                <Typography variant="body2">{row.yieldPercentage}%</Typography>
            ),
        },
        {
            id: 'status',
            label: 'Status',
            render: (row) => (
                <Chip
                    label={row.isActive ? 'Active' : 'Inactive'}
                    color={row.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ borderRadius: '8px' }}
                />
            ),
        },
        {
            id: 'actions',
            label: 'Actions',
            width: 120,
            render: (row) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(row)}
                        color="primary"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(row)}
                        color="error"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
                        Raw Materials
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your ingredients and raw materials
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        height: 48,
                        px: 3,
                        fontWeight: 600
                    }}
                >
                    Add Material
                </Button>
            </Box>

            <DataTable
                columns={columns}
                data={materials}
                loading={loading}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                pagination={pagination}
                emptyMessage="No materials found. Add your first raw material to get started."
            />

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingMaterial ? 'Edit Raw Material' : 'Add New Raw Material'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Material Code"
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingMaterial ? 'Save Changes' : 'Add Material'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                title="Delete Raw Material"
                message={`Are you sure you want to delete "${deletingMaterial?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                danger
            />
        </Box>
    );
}
