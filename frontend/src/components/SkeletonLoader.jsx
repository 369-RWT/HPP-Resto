import React from 'react';
import {
    Skeleton,
    TableRow,
    TableCell,
    Card,
    CardContent,
    Box,
    Grid
} from '@mui/material';

/**
 * Reusable skeleton loader components
 * Provides consistent loading states across the application
 */

// Skeleton for table rows
export const SkeletonTableRow = ({ columns = 5 }) => {
    return (
        <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
                <TableCell key={index}>
                    <Skeleton animation="wave" height={30} />
                </TableCell>
            ))}
        </TableRow>
    );
};

// Skeleton for multiple table rows
export const SkeletonTable = ({ rows = 5, columns = 5 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <SkeletonTableRow key={index} columns={columns} />
            ))}
        </>
    );
};

// Skeleton for dashboard cards
export const SkeletonCard = () => {
    return (
        <Card sx={{ height: '100%', borderRadius: '16px' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ ml: 2, flex: 1 }}>
                        <Skeleton animation="wave" height={24} width="60%" />
                    </Box>
                </Box>
                <Skeleton animation="wave" height={40} width="40%" sx={{ mb: 1 }} />
                <Skeleton animation="wave" height={20} width="80%" />
            </CardContent>
        </Card>
    );
};

// Skeleton for form fields
export const SkeletonForm = ({ fields = 4 }) => {
    return (
        <Box>
            {Array.from({ length: fields }).map((_, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                    <Skeleton animation="wave" height={20} width="30%" sx={{ mb: 1 }} />
                    <Skeleton animation="wave" height={56} />
                </Box>
            ))}
        </Box>
    );
};

// Skeleton for cost summary (Recipe Details)
export const SkeletonCostSummary = () => {
    return (
        <Card sx={{ borderRadius: '16px', bgcolor: 'primary.main' }}>
            <CardContent>
                <Skeleton
                    animation="wave"
                    height={32}
                    width="50%"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 2 }}
                />
                <Grid container spacing={2}>
                    {[1, 2, 3].map((item) => (
                        <Grid item xs={12} md={4} key={item}>
                            <Skeleton
                                animation="wave"
                                height={24}
                                width="40%"
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 1 }}
                            />
                            <Skeleton
                                animation="wave"
                                height={36}
                                width="60%"
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

// Skeleton for stat cards with icon
export const SkeletonStatCard = () => {
    return (
        <Card sx={{ height: '100%', borderRadius: '16px' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Skeleton animation="wave" height={20} width="60%" sx={{ mb: 1 }} />
                        <Skeleton animation="wave" height={40} width="80%" sx={{ mb: 1 }} />
                        <Skeleton animation="wave" height={16} width="40%" />
                    </Box>
                    <Skeleton variant="circular" width={48} height={48} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default {
    SkeletonTableRow,
    SkeletonTable,
    SkeletonCard,
    SkeletonForm,
    SkeletonCostSummary,
    SkeletonStatCard,
};
