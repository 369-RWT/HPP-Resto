import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid2 as Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Chip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Calculate as CalculateIcon,
} from '@mui/icons-material';
import api from '../services/api';

export default function VarianceAnalysis() {
    const [productionLogs, setProductionLogs] = useState([]);
    const [selectedLogId, setSelectedLogId] = useState('');
    const [varianceData, setVarianceData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProductionLogs();
    }, []);

    const loadProductionLogs = async () => {
        try {
            const { data } = await api.get('/production-logs', {
                params: { limit: 50 },
            });
            setProductionLogs(data.data);
        } catch (error) {
            console.error('Failed to load production logs:', error);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedLogId) return;

        setLoading(true);
        try {
            const { data } = await api.post(`/variance-analysis/calculate/${selectedLogId}`);
            setVarianceData(data);
        } catch (error) {
            console.error('Failed to calculate variance:', error);
            alert(error.response?.data?.error || 'Failed to calculate variance. Make sure cost standards exist for this menu item.');
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
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    };

    const getVarianceColor = (variance) => {
        return variance < 0 ? 'success' : variance > 0 ? 'error' : 'default';
    };

    const getVarianceLabel = (variance) => {
        return variance < 0 ? 'Favorable' : variance > 0 ? 'Unfavorable' : 'On Target';
    };

    const selectedLog = productionLogs.find(log => log.id === selectedLogId);

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
                    Variance Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Compare actual vs standard costs
                </Typography>
            </Box>

            {/* Selection */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                        <FormControl fullWidth>
                            <InputLabel>Select Production Log</InputLabel>
                            <Select
                                value={selectedLogId}
                                onChange={(e) => {
                                    setSelectedLogId(e.target.value);
                                    setVarianceData(null);
                                }}
                                label="Select Production Log"
                            >
                                {productionLogs.map((log) => (
                                    <MenuItem key={log.id} value={log.id}>
                                        {new Date(log.productionDate).toLocaleDateString('id-ID')} - {log.menuItem.name} ({log.portionsProduced} portions)
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<CalculateIcon />}
                            onClick={handleAnalyze}
                            disabled={!selectedLogId || loading}
                            sx={{ height: 56, fontWeight: 700 }}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Variance'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Variance Analysis */}
            {varianceData && (
                <Box>
                    {/* Overall Variance */}
                    <Paper sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: '16px',
                        bgcolor: varianceData.analysis.variance < 0 ? 'success.main' : 'error.main',
                        color: 'white'
                    }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid>
                                {varianceData.analysis.variance < 0 ? (
                                    <TrendingDownIcon sx={{ fontSize: 60 }} />
                                ) : (
                                    <TrendingUpIcon sx={{ fontSize: 60 }} />
                                )}
                            </Grid>
                            <Grid size="grow">
                                <Typography variant="h5" fontWeight={700} gutterBottom>
                                    {getVarianceLabel(varianceData.analysis.variance)}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Overall cost variance: {formatPercentage(varianceData.analysis.variancePercentage)}
                                </Typography>
                            </Grid>
                            <Grid sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Total Variance
                                </Typography>
                                <Typography variant="h3" fontWeight={700}>
                                    {formatCurrency(Math.abs(varianceData.analysis.variance))}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Cost Comparison */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                                <CardContent>
                                    <Typography variant="caption" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                        Standard Cost
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="primary.main">
                                        {formatCurrency(varianceData.analysis.standardCost)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Expected cost based on recipe standards
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                                <CardContent>
                                    <Typography variant="caption" color="text.secondary" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                        Actual Cost
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="warning.main">
                                        {formatCurrency(varianceData.analysis.actualCost)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Actual cost from production log
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Variance Breakdown */}
                    <Paper sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Box sx={{ p: 3, bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="h6" fontWeight={600}>
                                Variance Breakdown
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Category</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Standard</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Actual</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Variance</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Material Variance */}
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                Material Cost
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(varianceData.analysis.breakdown.material.standard)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(varianceData.analysis.breakdown.material.actual)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                color={getVarianceColor(varianceData.analysis.breakdown.material.variance)}
                                                fontWeight={600}
                                            >
                                                {formatCurrency(Math.abs(varianceData.analysis.breakdown.material.variance))}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={getVarianceLabel(varianceData.analysis.breakdown.material.variance)}
                                                color={getVarianceColor(varianceData.analysis.breakdown.material.variance)}
                                                size="small"
                                                sx={{ borderRadius: '8px', fontWeight: 600 }}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    {/* Labor Variance */}
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                Labor Cost
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(varianceData.analysis.breakdown.labor.standard)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(varianceData.analysis.breakdown.labor.actual)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                color={getVarianceColor(varianceData.analysis.breakdown.labor.variance)}
                                                fontWeight={600}
                                            >
                                                {formatCurrency(Math.abs(varianceData.analysis.breakdown.labor.variance))}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={getVarianceLabel(varianceData.analysis.breakdown.labor.variance)}
                                                color={getVarianceColor(varianceData.analysis.breakdown.labor.variance)}
                                                size="small"
                                                sx={{ borderRadius: '8px', fontWeight: 600 }}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    {/* Overhead Variance */}
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                Overhead Cost
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(varianceData.analysis.breakdown.overhead.standard)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(varianceData.analysis.breakdown.overhead.actual)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                color={getVarianceColor(varianceData.analysis.breakdown.overhead.variance)}
                                                fontWeight={600}
                                            >
                                                {formatCurrency(Math.abs(varianceData.analysis.breakdown.overhead.variance))}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={getVarianceLabel(varianceData.analysis.breakdown.overhead.variance)}
                                                color={getVarianceColor(varianceData.analysis.breakdown.overhead.variance)}
                                                size="small"
                                                sx={{ borderRadius: '8px', fontWeight: 600 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {/* Empty State */}
            {!varianceData && !loading && (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '16px', boxShadow: 'none', border: '1px dashed', borderColor: 'divider' }}>
                    <CalculateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
                        Select a production log and click Analyze to view variance analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Note: Cost standards must be calculated first for the selected menu item
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}
