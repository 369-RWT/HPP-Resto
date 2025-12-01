import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import {
    Calculate as CalculateIcon,
    AttachMoney as MoneyIcon,
    WorkOutline as LaborIcon,
    BusinessCenter as OverheadIcon,
} from '@mui/icons-material';
import api from '../services/api';

export default function CostCalculation() {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [costData, setCostData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMenuItems();
    }, []);

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

    const handleCalculate = async () => {
        if (!selectedItemId) return;

        setLoading(true);
        try {
            const { data } = await api.post(`/cost-standards/calculate/${selectedItemId}`);
            setCostData(data);
        } catch (error) {
            console.error('Failed to calculate cost:', error);
            alert(error.response?.data?.error || 'Failed to calculate cost');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const selectedMenuItem = menuItems.find(item => item.id === selectedItemId);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
                    Cost Calculation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Calculate standard costs for menu items
                </Typography>
            </Box>

            {/* Selection */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <FormControl fullWidth>
                            <InputLabel>Select Menu Item</InputLabel>
                            <Select
                                value={selectedItemId}
                                onChange={(e) => {
                                    setSelectedItemId(e.target.value);
                                    setCostData(null); // Reset cost data when changing item
                                }}
                                label="Select Menu Item"
                            >
                                {menuItems.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name} {item.category && `(${item.category})`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<CalculateIcon />}
                            onClick={handleCalculate}
                            disabled={!selectedItemId || loading}
                            sx={{ height: 56, fontWeight: 700 }}
                        >
                            {loading ? 'Calculating...' : 'Calculate Cost'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Cost Breakdown */}
            {costData && (
                <Box>
                    {/* Header */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: '16px', bgcolor: 'primary.main', color: 'white' }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    {selectedMenuItem?.name}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Standard Portion: {costData.breakdown.standardPortion} portions
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Cost per Portion
                                </Typography>
                                <Typography variant="h3" fontWeight={700}>
                                    {formatCurrency(costData.breakdown.costPerPortion)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Detailed Breakdown */}
                    <Paper sx={{ p: 3, borderRadius: '16px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Material Cost
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {formatCurrency(costData.breakdown.materialCost)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Labor Cost
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {formatCurrency(costData.breakdown.laborCost)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Overhead Cost
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {formatCurrency(costData.breakdown.overheadCost)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" fontWeight={700}>
                                    Total Cost
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" fontWeight={700} color="primary.main">
                                    {formatCurrency(costData.breakdown.totalCost)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" fontWeight={600}>
                                    Cost per Portion
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="body1" fontWeight={700} color="primary.main">
                                    {formatCurrency(costData.breakdown.costPerPortion)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            )}

            {/* Empty State */}
            {!costData && !loading && (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '16px', boxShadow: 'none', border: '1px dashed', borderColor: 'divider' }}>
                    <CalculateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                        Select a menu item and click Calculate to view cost breakdown
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
