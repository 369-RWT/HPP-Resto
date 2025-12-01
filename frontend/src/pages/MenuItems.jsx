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
    Grid2 as Grid,
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
    RestaurantMenu as RecipeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MenuItems() {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingItem, setDeletingItem] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        category: '',
        standardPortion: 1,
        standardPortionUnit: 'portion',
        standardLaborHours: 0,
        isActive: true,
    });

    useEffect(() => {
        loadMenuItems();
    }, [pagination.page, pagination.limit, searchTerm]);

    const loadMenuItems = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/menu-items', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    search: searchTerm,
                },
            });
            setMenuItems(data.data);
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total,
            }));
        } catch (error) {
            console.error('Failed to load menu items:', error);
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

    const handleOpenDialog = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                code: item.code || '',
                name: item.name || '',
                category: item.category || '',
                standardPortion: item.standardPortion || 1,
                standardPortionUnit: item.standardPortionUnit || 'portion',
                standardLaborHours: item.standardLaborHours || 0,
                isActive: item.isActive,
            });
        } else {
            setEditingItem(null);
            setFormData({
                code: '',
                name: '',
                category: '',
                standardPortion: 1,
                standardPortionUnit: 'portion',
                standardLaborHours: 0,
                isActive: true,
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingItem(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['standardPortion', 'standardLaborHours'].includes(name)
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (editingItem) {
                await api.put(`/menu-items/${editingItem.id}`, formData);
            } else {
                await api.post('/menu-items', formData);
            }
            handleCloseDialog();
            loadMenuItems();
        } catch (error) {
            console.error('Failed to save menu item:', error);
            alert(error.response?.data?.error || 'Failed to save menu item');
        }
    };

    const handleOpenDeleteDialog = (item) => {
        setDeletingItem(item);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeletingItem(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/menu-items/${deletingItem.id}`);
            handleCloseDeleteDialog();
            loadMenuItems();
        } catch (error) {
            console.error('Failed to delete menu item:', error);
        }
    };

    const handleViewRecipe = (item) => {
        navigate(`/menu-items/${item.id}/recipe`);
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
            id: 'portion',
            label: 'Standard Portion',
            render: (row) => (
                <Typography variant="body2">
                    {row.standardPortion} {row.standardPortionUnit}
                </Typography>
            ),
        },
        {
            id: 'labor',
            label: 'Labor Hours',
            render: (row) => (
                <Typography variant="body2">{row.standardLaborHours}h</Typography>
            ),
        },
        {
            id: 'ingredients',
            label: 'Ingredients',
            render: (row) => (
                <Typography variant="body2">
                    {row._count?.recipeDetails || 0}
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
            width: 160,
            render: (row) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => handleViewRecipe(row)}
                        color="primary"
                        title="View Recipe"
                    >
                        <RecipeIcon fontSize="small" />
                    </IconButton>
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
                        Menu Items
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your culinary catalog and pricing
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
                    Add Item
                </Button>
            </Box>

            <DataTable
                columns={columns}
                data={menuItems}
                loading={loading}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                pagination={pagination}
                emptyMessage="No menu items found. Add your first menu item to get started."
            />

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Item Code"
                                name="code"
                                value={formData.code}
                                onChange={handleFormChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                                placeholder="e.g., Main Course, Appetizer, Dessert"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Standard Portion"
                                name="standardPortion"
                                type="number"
                                value={formData.standardPortion}
                                onChange={handleFormChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Portion Unit</InputLabel>
                                <Select
                                    name="standardPortionUnit"
                                    value={formData.standardPortionUnit}
                                    onChange={handleFormChange}
                                    label="Portion Unit"
                                    required
                                >
                                    <MenuItem value="portion">Portion</MenuItem>
                                    <MenuItem value="plate">Plate</MenuItem>
                                    <MenuItem value="serving">Serving</MenuItem>
                                    <MenuItem value="pcs">Pieces</MenuItem>
                                    <MenuItem value="kg">Kilogram</MenuItem>
                                    <MenuItem value="l">Liter</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Standard Labor Hours"
                                name="standardLaborHours"
                                type="number"
                                value={formData.standardLaborHours}
                                onChange={handleFormChange}
                                helperText="Time required to prepare one portion"
                                InputProps={{
                                    endAdornment: <span style={{ marginLeft: 8, color: '#86868B' }}>hours</span>
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingItem ? 'Save Changes' : 'Add Item'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                title="Delete Menu Item"
                message={`Are you sure you want to delete "${deletingItem?.name}"? This will also delete all recipe details. This action cannot be undone.`}
                confirmText="Delete"
                danger
            />
        </Box>
    );
}
