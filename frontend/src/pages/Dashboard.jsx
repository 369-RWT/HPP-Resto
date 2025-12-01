import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
} from '@mui/material';
import {
    LocalShipping,
    Inventory,
    Restaurant,
    TrendingUp,
} from '@mui/icons-material';
import api from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const { data } = await api.get('/reports/dashboard');
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
                    Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Overview of your production costs and inventory
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Statistics Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: 'primary.light',
                                    color: 'white',
                                    display: 'flex'
                                }}>
                                    <LocalShipping fontSize="medium" />
                                </Box>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Suppliers
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats?.counts?.suppliers || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: 'secondary.main',
                                    color: 'white',
                                    display: 'flex'
                                }}>
                                    <Inventory fontSize="medium" />
                                </Box>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Raw Materials
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats?.counts?.materials || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: 'success.main',
                                    color: 'white',
                                    display: 'flex'
                                }}>
                                    <Restaurant fontSize="medium" />
                                </Box>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Menu Items
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats?.counts?.menuItems || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    bgcolor: 'warning.main',
                                    color: 'white',
                                    display: 'flex'
                                }}>
                                    <TrendingUp fontSize="medium" />
                                </Box>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Recent Production
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats?.counts?.recentProduction || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Welcome Message */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="h5" gutterBottom fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
                            Welcome to CostFlow
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
                            Food Production Cost Accounting System - Your comprehensive solution for managing food costs, recipes, and profitability analysis.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                • Add new suppliers and materials
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                • Create menu items and recipes
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                • Log daily production
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                • Calculate costs and analyze variance
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Variance Summary */}
                {stats?.variance && (
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%', borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                Variance Summary
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h3" color={stats.variance.average > 0 ? 'error.main' : 'success.main'} fontWeight={700}>
                                    {stats.variance.average}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Average Variance based on {stats.variance.recentCount} recent records
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
