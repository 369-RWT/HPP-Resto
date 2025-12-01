import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid2 as Grid,
    Alert,
} from '@mui/material';
import api from '../services/api';
import useAppStore from '../store/appStore';

export default function Settings() {
    const { businessSettings, setBusinessSettings } = useAppStore();
    const [formData, setFormData] = useState({
        businessName: '',
        address: '',
        phone: '',
        email: '',
        laborRatePerHour: 0,
        currency: 'IDR',
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data } = await api.get('/auth/settings');
            setFormData(data);
            setBusinessSettings(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
            // First time setup
            if (error.response?.status === 404) {
                setMessage({ type: 'info', text: 'Please initialize your business settings' });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'laborRatePerHour' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (businessSettings?.id) {
                // Update existing
                await api.put('/auth/settings', formData);
                setMessage({ type: 'success', text: 'Settings updated successfully' });
            } else {
                // Initialize
                await api.post('/auth/init', formData);
                setMessage({ type: 'success', text: 'Business initialized successfully' });
            }
            await loadSettings();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="md" sx={{ mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
                    Business Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your business details and preferences
                </Typography>
            </Box>

            {message && (
                <Alert
                    severity={message.type}
                    sx={{
                        mb: 3,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: message.type === 'success' ? 'success.light' : 'error.light',
                        '& .MuiAlert-icon': {
                            fontSize: 24
                        }
                    }}
                >
                    {message.text}
                </Alert>
            )}

            <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                General Information
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Business Name"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                Financial Settings
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Labor Rate per Hour"
                                name="laborRatePerHour"
                                type="number"
                                value={formData.laborRatePerHour}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <span style={{ marginRight: 8, color: '#86868B' }}>IDR</span>
                                }}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                disabled
                                variant="outlined"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    minWidth: 200,
                                    height: 48,
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                {loading ? 'Saving...' : (businessSettings?.id ? 'Save Changes' : 'Initialize Business')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
