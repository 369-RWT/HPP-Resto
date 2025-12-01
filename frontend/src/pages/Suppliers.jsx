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
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import api from '../services/api';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [deletingSupplier, setDeletingSupplier] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        paymentTerms: '',
        isActive: true,
    });

    useEffect(() => {
        loadSuppliers();
    }, [pagination.page, pagination.limit, searchTerm]);

    const loadSuppliers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/suppliers', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    search: searchTerm,
                },
            });
            setSuppliers(data.data);
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total,
            }));
        } catch (error) {
            console.error('Failed to load suppliers:', error);
        } finally {
            setLoading(false);
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

    const handleOpenDialog = (supplier = null) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData({
                name: supplier.name || '',
                contactPerson: supplier.contactPerson || '',
                phone: supplier.phone || '',
                email: supplier.email || '',
                address: supplier.address || '',
                paymentTerms: supplier.paymentTerms || '',
                isActive: supplier.isActive,
            });
        } else {
            setEditingSupplier(null);
            setFormData({
                name: '',
                contactPerson: '',
                phone: '',
                email: '',
                address: '',
                paymentTerms: '',
                isActive: true,
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingSupplier(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (editingSupplier) {
                await api.put(`/suppliers/${editingSupplier.id}`, formData);
            } else {
                await api.post('/suppliers', formData);
            }
            handleCloseDialog();
            loadSuppliers();
        } catch (error) {
            console.error('Failed to save supplier:', error);
        }
    };

    const handleOpenDeleteDialog = (supplier) => {
        setDeletingSupplier(supplier);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeletingSupplier(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/suppliers/${deletingSupplier.id}`);
            handleCloseDeleteDialog();
            loadSuppliers();
        } catch (error) {
            console.error('Failed to delete supplier:', error);
        }
    };

    const columns = [
        {
            id: 'name',
            label: 'Name',
            render: (row) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>
                        {row.name}
                    </Typography>
                    {row.contactPerson && (
                        <Typography variant="caption" color="text.secondary">
                            {row.contactPerson}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            id: 'contact',
            label: 'Contact',
            render: (row) => (
                <Box>
                    {row.phone && (
                        <Typography variant="body2">{row.phone}</Typography>
                    )}
                    {row.email && (
                        <Typography variant="caption" color="text.secondary">
                            {row.email}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            id: 'materials',
            label: 'Materials',
            render: (row) => (
                <Typography variant="body2">
                    {row._count?.rawMaterials || 0}
                </Typography>
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
                        Suppliers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your supplier information
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
                    Add Supplier
                </Button>
            </Box>

            <DataTable
                columns={columns}
                data={suppliers}
                loading={loading}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                pagination={pagination}
                emptyMessage="No suppliers found. Add your first supplier to get started."
            />

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Supplier Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="address"
                                    multiline
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Payment Terms"
                                    name="paymentTerms"
                                    value={formData.paymentTerms}
                                    onChange={handleFormChange}
                                    placeholder="e.g., Net 30 days"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingSupplier ? 'Save Changes' : 'Add Supplier'}
                    </Button>
                </DialogActions>
            </Dialog >

            {/* Delete Confirmation Dialog */}
            < ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                title="Delete Supplier"
                message={`Are you sure you want to delete "${deletingSupplier?.name}"? This action cannot be undone.`
                }
                confirmText="Delete"
                danger
            />
        </Box >
    );
}
