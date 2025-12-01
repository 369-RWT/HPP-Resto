import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    Breadcrumbs,
    Link,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

export default function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [menuItem, setMenuItem] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [deletingIngredient, setDeletingIngredient] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        rawMaterialId: '',
        quantity: 0,
        unit: 'kg',
        sequence: null,
        notes: '',
    });

    useEffect(() => {
        loadMenuItemAndRecipe();
        loadMaterials();
    }, [id]);

    const loadMenuItemAndRecipe = async () => {
        setLoading(true);
        try {
            const [menuResponse, recipeResponse] = await Promise.all([
                api.get(`/menu-items/${id}`),
                api.get(`/recipes/${id}/details`),
            ]);
            setMenuItem(menuResponse.data);
            setIngredients(recipeResponse.data);
        } catch (error) {
            console.error('Failed to load recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMaterials = async () => {
        try {
            const { data } = await api.get('/materials', {
                params: { limit: 100, isActive: true },
            });
            setMaterials(data.data);
        } catch (error) {
            console.error('Failed to load materials:', error);
        }
    };

    const handleOpenDialog = (ingredient = null) => {
        if (ingredient) {
            setEditingIngredient(ingredient);
            setFormData({
                rawMaterialId: ingredient.rawMaterialId,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                sequence: ingredient.sequence,
                notes: ingredient.notes || '',
            });
        } else {
            setEditingIngredient(null);
            setFormData({
                rawMaterialId: '',
                quantity: 0,
                unit: 'kg',
                sequence: null,
                notes: '',
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingIngredient(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['quantity', 'sequence', 'rawMaterialId'].includes(name)
                ? (value === '' ? null : Number(value))
                : value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (editingIngredient) {
                await api.put(`/recipes/${id}/details/${editingIngredient.id}`, formData);
            } else {
                await api.post(`/recipes/${id}/details`, formData);
            }
            handleCloseDialog();
            loadMenuItemAndRecipe();
        } catch (error) {
            console.error('Failed to save ingredient:', error);
            alert(error.response?.data?.error || 'Failed to save ingredient');
        }
    };

    const handleOpenDeleteDialog = (ingredient) => {
        setDeletingIngredient(ingredient);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeletingIngredient(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/recipes/${id}/details/${deletingIngredient.id}`);
            handleCloseDeleteDialog();
            loadMenuItemAndRecipe();
        } catch (error) {
            console.error('Failed to delete ingredient:', error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const calculateTotalCost = () => {
        return ingredients.reduce((sum, ing) => {
            const cost = (ing.quantity * ing.rawMaterial.currentPrice) / ing.rawMaterial.yieldPercentage * 100;
            return sum + cost;
        }, 0);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (!menuItem) {
        return (
            <Box>
                <Typography>Menu item not found</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link
                        component="button"
                        onClick={() => navigate('/menu-items')}
                        sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                    >
                        Menu Items
                    </Link>
                    <Typography color="text.primary">{menuItem.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            Recipe: {menuItem.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Chip
                                label={menuItem.category || 'Uncategorized'}
                                size="small"
                                sx={{ borderRadius: '8px' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {menuItem.standardPortion} {menuItem.standardPortionUnit}
                            </Typography>
                        </Box>
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
                        Add Ingredient
                    </Button>
                </Box>
            </Box>

            {/* Ingredients Table */}
            <Paper sx={{ borderRadius: '16px', overflow: 'hidden', mb: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'background.default' }}>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Ingredient</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Unit Price</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Yield %</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Cost</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Supplier</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 120, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ingredients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">
                                        No ingredients added yet. Add your first ingredient to start building the recipe.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            ingredients.map((ingredient) => {
                                const cost = (ingredient.quantity * ingredient.rawMaterial.currentPrice) / ingredient.rawMaterial.yieldPercentage * 100;
                                return (
                                    <TableRow key={ingredient.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {ingredient.rawMaterial.name}
                                            </Typography>
                                            {ingredient.notes && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {ingredient.notes}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {ingredient.quantity} {ingredient.unit}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatCurrency(ingredient.rawMaterial.currentPrice)}/{ingredient.rawMaterial.unit}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {ingredient.rawMaterial.yieldPercentage}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600} color="primary.main">
                                                {formatCurrency(cost)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {ingredient.rawMaterial.supplier?.name || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(ingredient)}
                                                color="primary"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDeleteDialog(ingredient)}
                                                color="error"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Cost Summary */}
            {ingredients.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: '16px', bgcolor: 'primary.main', color: 'white' }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                                Total Ingredients
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                                {ingredients.length}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                                Total Material Cost
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                                {formatCurrency(calculateTotalCost())}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                                Cost per Portion
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                                {formatCurrency(calculateTotalCost() / menuItem.standardPortion)}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                                Standard Portion
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                                {menuItem.standardPortion} {menuItem.standardPortionUnit}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Raw Material</InputLabel>
                                    <Select
                                        name="rawMaterialId"
                                        value={formData.rawMaterialId}
                                        onChange={handleFormChange}
                                        label="Raw Material"
                                    >
                                        {materials.map((material) => (
                                            <MenuItem key={material.id} value={material.id}>
                                                {material.name} ({material.code}) - {formatCurrency(material.currentPrice)}/{material.unit}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleFormChange}
                                    required
                                    helperText="e.g., kg, g, l, ml"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleFormChange}
                                    multiline
                                    rows={2}
                                    placeholder="Optional preparation notes"
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
                        {editingIngredient ? 'Save Changes' : 'Add Ingredient'}
                    </Button>
                </DialogActions>
            </Dialog >

            {/* Delete Confirmation Dialog */}
            < ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                title="Remove Ingredient"
                message={`Are you sure you want to remove "${deletingIngredient?.rawMaterial?.name}" from this recipe?`
                }
                confirmText="Remove"
                danger
            />
        </Box >
    );
}
