import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid2 as Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Tabs,
    Tab,
    Chip,
    Divider,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
    Assessment as AssessmentIcon,
    DateRange as DateIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import api from '../services/api';

export default function Reports() {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    // Profitability state
    const [profitabilityData, setProfitabilityData] = useState([]);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    });

    // Monthly summary state
    const [monthlySummary, setMonthlySummary] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (activeTab === 0) {
            loadProfitability();
        } else if (activeTab === 1) {
            loadMonthlySummary();
        }
    }, [activeTab, dateRange, selectedMonth, selectedYear]);

    const loadProfitability = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/reports/menu-profitability', {
                params: {
                    startDate: dateRange.start,
                    endDate: dateRange.end,
                },
            });
            setProfitabilityData(data);
        } catch (error) {
            console.error('Failed to load profitability report:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMonthlySummary = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/reports/monthly-summary', {
                params: {
                    month: selectedMonth,
                    year: selectedYear,
                },
            });
            setMonthlySummary(data);
        } catch (error) {
            console.error('Failed to load monthly summary:', error);
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

    const formatPercentage = (value) => {
        return `${value.toFixed(2)}%`;
    };

    const getMarginColor = (margin) => {
        if (margin >= 40) return 'success';
        if (margin >= 25) return 'warning';
        return 'error';
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
                    Reports & Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    View profitability analysis and performance summaries
                </Typography>
            </Box>

            {/* Tabs */}
            <Paper sx={{ borderRadius: '16px', mb: 3, overflow: 'hidden' }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider', px: 2, bgcolor: 'background.paper' }}
                >
                    <Tab label="Menu Profitability" sx={{ fontWeight: 600 }} />
                    <Tab label="Monthly Summary" sx={{ fontWeight: 600 }} />
                </Tabs>

                {/* Menu Profitability Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        {/* Date Range Filter */}
                        <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="End Date"
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={loadProfitability}
                                    sx={{ height: 56, fontWeight: 600 }}
                                >
                                    Refresh Data
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Profitability Table */}
                        <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'background.default' }}>
                                        <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Menu Item</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Units Sold</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Cost/Unit</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Selling Price</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Margin</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Total Revenue</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Total Profit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                                <Typography color="text.secondary">Loading...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : profitabilityData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                                <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                                                <Typography color="text.secondary" fontWeight={600}>
                                                    No sales data for selected period
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        profitabilityData.map((item, index) => (
                                            <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {item.menuName}
                                                    </Typography>
                                                    {item.category && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {item.category}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {item.totalSold}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2">
                                                        {formatCurrency(item.costPerPortion)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2">
                                                        {formatCurrency(item.sellingPrice)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={formatPercentage(item.marginPercentage)}
                                                        color={getMarginColor(item.marginPercentage)}
                                                        size="small"
                                                        sx={{ borderRadius: '8px', fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {formatCurrency(item.totalRevenue)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={700}
                                                        color={item.totalProfit >= 0 ? 'success.main' : 'error.main'}
                                                    >
                                                        {formatCurrency(item.totalProfit)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {/* Monthly Summary Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        {/* Month/Year Selection */}
                        <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    SelectProps={{ native: true }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    SelectProps={{ native: true }}
                                >
                                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={loadMonthlySummary}
                                    sx={{ height: 56, fontWeight: 600 }}
                                >
                                    Refresh Data
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Summary Cards */}
                        {monthlySummary && (
                            <>
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Card sx={{ height: '100%', borderRadius: '16px', bgcolor: 'success.main', color: 'white' }}>
                                            <CardContent>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    Total Revenue
                                                </Typography>
                                                <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                                                    {formatCurrency(monthlySummary.totalRevenue)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    {monthlySummary.productionCount} production batches
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Card sx={{ height: '100%', borderRadius: '16px', bgcolor: 'warning.main', color: 'white' }}>
                                            <CardContent>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    Total Cost
                                                </Typography>
                                                <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                                                    {formatCurrency(monthlySummary.totalCost)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Material: {formatCurrency(monthlySummary.totalMaterialCost)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Card sx={{
                                            height: '100%',
                                            borderRadius: '16px',
                                            bgcolor: monthlySummary.netProfit >= 0 ? 'primary.main' : 'error.main',
                                            color: 'white'
                                        }}>
                                            <CardContent>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    Net Profit
                                                </Typography>
                                                <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                                                    {formatCurrency(monthlySummary.netProfit)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Margin: {formatPercentage(monthlySummary.profitMargin)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Detailed Breakdown */}
                                <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Cost Breakdown
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Material Cost
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatCurrency(monthlySummary.totalMaterialCost)}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>
                                            <Chip
                                                label={formatPercentage(monthlySummary.foodCostPercentage)}
                                                size="small"
                                                sx={{ borderRadius: '8px', fontWeight: 600 }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Labor Cost
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatCurrency(monthlySummary.totalLaborCost)}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>
                                            <Chip
                                                label={formatPercentage(monthlySummary.laborCostPercentage)}
                                                size="small"
                                                sx={{ borderRadius: '8px', fontWeight: 600 }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Overhead Cost
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatCurrency(monthlySummary.totalOverheadCost)}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>
                                            <Chip
                                                label={formatPercentage(monthlySummary.overheadCostPercentage)}
                                                size="small"
                                                sx={{ borderRadius: '8px', fontWeight: 600 }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12 }}>
                                            <Divider sx={{ my: 1 }} />
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="h6" fontWeight={700}>
                                                Total Cost
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                                {formatCurrency(monthlySummary.totalCost)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </>
                        )}

                        {!monthlySummary && !loading && (
                            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '16px', boxShadow: 'none', border: '1px dashed', borderColor: 'divider' }}>
                                <DateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                                    No data available for selected period
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
