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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import api from '../services/api';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ProductionLog() {
    const [logs, setLogs] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [deletingLog, setDeletingLog] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        menuItemId: '',
        productionDate: new Date().toISOString().split('T')[0],
        portionsProduced: 0,
        portionsSold: 0,
        laborHoursActual: 0,
        notes: '',
    });

    useEffect(() => {
        loadLogs();
        loadMenuItems();
    }, [pagination.page, pagination.limit, dateFilter]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };
            if (dateFilter.start) params.startDate = dateFilter.start;
            if (dateFilter.end) params.endDate = dateFilter.end;

            const { data } = await api.get('/production-logs', { params });
            setLogs(data.data);
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total,
            }));
        } catch (error) {
            console.error('Failed to load production logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMenuItems = async () => {
        try {
            const { data } = await api.get('/menu-items', {
                params: { limit: 100, isActive: true },
            });
            setMenuItems(data.data);
        } catch (error) {
            console.error('Failed to load menu items:', error);
        }
    };

    const handlePageChange = (newPage, newLimit) => {
        setPagination(prev => ({
            ...prev,
            page: newPage,
            ...(newLimit && { limit: newLimit }),
        }));
    };

    const handleDateFilterChange = (field, value) => {
        setDateFilter(prev => ({ ...prev, [field]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleOpenDialog = (log = null) => {
        if (log) {
            setEditingLog(log);
            setFormData({
                menuItemId: log.menuItemId,
                productionDate: log.productionDate.split('T')[0],
                portionsProduced: log.portionsProduced,
                portionsSold: log.portionsSold || 0,
                laborHoursActual: log.laborHoursActual || 0,
                notes: log.notes || '',
            });
        } else {
            setEditingLog(null);
            setFormData({
                menuItemId: '',
                productionDate: new Date().toISOString().split('T')[0],
                portionsProduced: 0,
                portionsSold: 0,
                laborHoursActual: 0,
                notes: '',
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingLog(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['portionsProduced', 'portionsSold', 'laborHoursActual', 'menuItemId'].includes(name)
                ? (value === '' ? 0 : Number(value))
                : value
        }));
    };

    const handleSubmit = async () => {
        try {
            const submitData = {
                ...formData,
                productionDate: new Date(formData.productionDate).toISOString(),
            };

            if (editingLog) {
                await api.put(`/production-logs/${editingLog.id}`, submitData);
            } else {
                await api.post('/production-logs', submitData);
            }
            handleCloseDialog();
            loadLogs();
        } catch (error) {
            console.error('Failed to save production log:', error);
            alert(error.response?.data?.error || 'Failed to save production log');
        }
    };

    const handleOpenDeleteDialog = (log) => {
        setDeletingLog(log);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeletingLog(null);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/production-logs/${deletingLog.id}`);
            handleCloseDeleteDialog();
            loadLogs();
        } catch (error) {
            console.error('Failed to delete production log:', error);
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
            label: 'Date',
            render: (row) => (
                <Typography variant="body2" fontWeight={600}>
                    {formatDate(row.productionDate)}
                </Typography>
            ),
        },
        {
            id: 'menuItem',
            label: 'Menu Item',
            render: (row) => (
                <Box>
                    <Typography variant="body2" fontWeight={600}>
                        {row.menuItem.name}
                    </Typography>
                    {row.menuItem.category && (
                        <Typography variant="caption" color="text.secondary">
                            {row.menuItem.category}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            id: 'portions',
            label: 'Portions',
            render: (row) => (
                <Box>
                    <Typography variant="body2">
                        Produced: <strong>{row.portionsProduced}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Sold: {row.portionsSold || 0}
                    </Typography>
                </Box>
            ),
        },
        {
            id: 'labor',
            label: 'Labor Hours',
            render: (row) => (
                <Typography variant="body2">
                    {row.laborHoursActual || 0}h
                </Typography>
            ),
        },
        {
            id: 'efficiency',
            label: 'Efficiency',
            render: (row) => {
                const sold = row.portionsSold || 0;
                const produced = row.portionsProduced;
                const efficiency = produced > 0 ? (sold / produced * 100) : 0;
                const color = efficiency >= 90 ? 'success' : efficiency >= 70 ? 'warning' : 'error';

                return (
                    <Chip
                        label={`${efficiency.toFixed(0)}%`}
                        color={color}
                        size="small"
                        sx={{ borderRadius: '8px' }}
                    />
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
                        Production Log
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track daily production and sales performance
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
                    Add Log Entry
                </Button>
            </Box>

            {/* Date Filter */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, maxWidth: 600 }}>
                <TextField
                    label="Start Date"
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) => handleDateFilterChange('start', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) => handleDateFilterChange('end', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

            <DataTable
                columns={columns}
                data={logs}
                loading={loading}
                onPageChange={handlePageChange}
                pagination={pagination}
                emptyMessage="No production logs found. Add your first entry to start tracking."
            />

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingLog ? 'Edit Production Log' : 'Add Production Log'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Menu Item</InputLabel>
                                    <Select
                                        name="menuItemId"
                                        value={formData.menuItemId}
                                        onChange={handleFormChange}
                                        label="Menu Item"
                                    >
                                        {menuItems.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.name} ({item.category})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Production Date"
                                    name="productionDate"
                                    type="date"
                                    value={formData.productionDate}
                                    onChange={handleFormChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Portions Produced"
                                    name="portionsProduced"
                                    type="number"
                                    value={formData.portionsProduced}
                                    onChange={handleFormChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Portions Sold"
                                    name="portionsSold"
                                    type="number"
                                    value={formData.portionsSold}
                                    onChange={handleFormChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Labor Hours"
                                    name="laborHoursActual"
                                    type="number"
                                    value={formData.laborHoursActual}
                                    onChange={handleFormChange}
                                    InputProps={{
                                        endAdornment: <span style={{ marginLeft: 8, color: '#86868B' }}>hours</span>
                                    }}
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
                                    placeholder="Optional notes about this production run"
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
                        {editingLog ? 'Save Changes' : 'Add Log'}
                    </Button>
                </DialogActions>
            </Dialog >

            {/* Delete Confirmation Dialog */}
            < ConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                title="Delete Production Log"
                message={`Are you sure you want to delete this production log? This action cannot be undone.`
                }
                confirmText="Delete"
                danger
            />
        </Box >
    );
}
