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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    Paper,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Science as ScienceIcon,
} from '@mui/icons-material';
import api from '../services/api';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

export default function YieldTesting() {
    const [tests, setTests] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [deletingTest, setDeletingTest] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        rawMaterialId: '',
        testDate: new Date().toISOString().split('T')[0],
        apWeight: 0,    // As Purchased
        epWeight: 0,    // Edible Portion
        notes: '',
    });

    // Calculated yield percentage
    const calculatedYield = formData.apWeight > 0
        ? ((formData.epWeight / formData.apWeight) * 100).toFixed(2)
        : 0;

    useEffect(() => {
        loadTests();
        loadMaterials();
    }, [pagination.page, pagination.limit]);

    const loadTests = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/yield-tests', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                },
            });
            setTests(data.data);
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total,
            }));
        } catch (error) {
            console.error('Failed to load yield tests:', error);
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

    const handlePageChange = (newPage, newLimit) => {
        setPagination(prev => ({
            ...prev,
            page: newPage,
            ...(newLimit && { limit: newLimit }),
        }));
    };

    const handleOpenDialog = (test = null) => {
        if (test) {
            setEditingTest(test);
            setFormData({
                rawMaterialId: test.rawMaterialId,
                testDate: test.testDate.split('T')[0],
                apWeight: test.apWeight,
                epWeight: test.epWeight,
                notes: test.notes || '',
            });
        } else {
            setEditingTest(null);
            setFormData({
                rawMaterialId: '',
                testDate: new Date().toISOString().split('T')[0],
                apWeight: 0,
                epWeight: 0,
                notes: '',
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingTest(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['apWeight', 'epWeight', 'rawMaterialId'].includes(name)
                ? (value === '' ? 0 : Number(value))
                : value
        }));
    };

    const handleSubmit = async () => {
        try {
            const submitData = {
                ...formData,
                testDate: new Date(formData.testDate).toISOString(),
            };

            if (editingTest) {
                await api.put(`/yield-tests/${editingTest.id}`, submitData);
            } else {
                await api.post('/yield-tests', submitData);
            }
            handleCloseDialog();
            loadTests();
            loadMaterials(); // Reload to get updated yield percentages
        } catch (error) {
            console.error('Failed to save yield test:', error);
            alert(error.response?.data?.error || 'Failed to save yield test');
        }
    };

    const handleOpenDeleteDialog = (test) => {
        setDeletingTest(test);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeletingTest(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/yield-tests/${deletingTest.id}`);
            handleCloseDeleteDialog();
            loadTests();
        } catch (error) {
            console.error('Failed to delete yield test:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const columns = [
        {
            id: 'date',
            label: 'Test Date',
            render: (row) => (
                <Typography variant="body2" fontWeight={600}>
                    {formatDate(row.testDate)}
                </Typography>
            ),
        },
        {
            id: 'material',
            label: 'Material',
            render: (row) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>
                        {row.rawMaterial.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {row.rawMaterial.code}
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'weights',
            label: 'Weights',
            render: (row) => (
                <Box>
                    <Typography variant="body2">
                        AP: <strong>{row.apWeight}</strong> {row.rawMaterial.unit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        EP: {row.epWeight} {row.rawMaterial.unit}
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'yield',
            label: 'Yield %',
            render: (row) => {
                const yieldPercent = row.yieldPercentage;
                const color = yieldPercent >= 90 ? 'success' : yieldPercent >= 75 ? 'warning' : 'error';

                return (
                    <Chip
                        label={`${yieldPercent.toFixed(2)}%`}
                        color={color}
                        size="small"
                        sx={{ borderRadius: '8px', fontWeight: 600 }}
                    />
                );
            },
        },
        {
            id: 'waste',
            label: 'Waste',
            render: (row) => {
                const waste = row.apWeight - row.epWeight;
                const wastePercent = ((waste / row.apWeight) * 100).toFixed(2);

                return (
                    <Typography variant="body2">
                        {waste.toFixed(2)} {row.rawMaterial.unit} ({wastePercent}%)
                    </Typography>
                );
            },
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
                        Yield Testing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track material yield and waste percentages
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
                    Add Test
                </Button>
            </Box>

            {/* Info Card */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', bgcolor: 'primary.light', color: 'white' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid>
                        <ScienceIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                    </Grid>
                    <Grid size="grow">
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            About Yield Testing
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.95 }}>
                            Yield testing helps determine the usable portion of raw materials. Record the "As Purchased" (AP) weight
                            and "Edible Portion" (EP) weight to calculate yield percentage. This data automatically updates material
                            costs for accurate recipe costing.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <DataTable
                columns={columns}
                data={tests}
                loading={loading}
                onPageChange={handlePageChange}
                pagination={pagination}
                emptyMessage="No yield tests found. Add your first test to start tracking material efficiency."
            />

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingTest ? 'Edit Yield Test' : 'Add Yield Test'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel>Raw Material</InputLabel>
                                <Select
                                    name="rawMaterialId"
                                    value={formData.rawMaterialId}
                                    onChange={handleFormChange}
                                    label="Raw Material"
                                    required
                                >
                                    {materials.map((material) => (
                                        <MenuItem key={material.id} value={material.id}>
                                            {material.name} ({material.unit})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Test Date"
                                name="testDate"
                                type="date"
                                value={formData.testDate}
                                onChange={handleFormChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="As Purchased (AP) Weight"
                                name="apWeight"
                                type="number"
                                value={formData.apWeight}
                                onChange={handleFormChange}
                                required
                                helperText="Total weight as received"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Edible Portion (EP) Weight"
                                name="epWeight"
                                type="number"
                                value={formData.epWeight}
                                onChange={handleFormChange}
                                required
                                helperText="Usable weight after prep"
                            />
                        </Grid>

                        {/* Calculated Yield Display */}
                        {formData.apWeight > 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: '12px' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        Calculated Yield Percentage
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {calculatedYield}%
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                        Waste: {(100 - calculatedYield).toFixed(2)}%
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleFormChange}
                                multiline
                                rows={2}
                                placeholder="Optional notes about this test"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingTest ? 'Save Changes' : 'Add Test'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                title="Delete Yield Test"
                message={`Are you sure you want to delete this yield test? This action cannot be undone.`}
                confirmText="Delete"
                danger
            />
        </Box>
    );
}
