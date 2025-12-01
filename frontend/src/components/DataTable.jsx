import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    TextField,
    InputAdornment,
    Box,
    Typography,
} from '@mui/material';
import { SkeletonTable } from './SkeletonLoader';
import SearchIcon from '@mui/icons-material/Search';
import { AssessmentOutlined as EmptyIcon } from '@mui/icons-material';

/**
 * Reusable data table component with search, pagination, and accessibility
 * @param {Array} columns - Column definitions with label, field, and optional render
 * @param {Array} data - Data array to display
 * @param {Boolean} loading - Loading state
 * @param {Function} onSearch - Search handler
 * @param {Function} onPageChange - Page change handler
 * @param {Object} pagination - Pagination config {page, rowsPerPage, totalCount}
 * @param {String} emptyMessage - Message shown when no data
 * @param {String} ariaLabel - ARIA label for the table
 */
export default function DataTable({
    columns,
    data,
    loading = false,
    onSearch,
    onPageChange,
    pagination,
    emptyMessage = 'No data found',
    ariaLabel = 'Data table',
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handlePageChange = (event, newPage) => {
        if (onPageChange) {
            onPageChange(newPage + 1);
        }
    };

    const handleRowsPerPageChange = (event) => {
        if (onPageChange) {
            onPageChange(1, parseInt(event.target.value, 10));
        }
    };

    return (
        <Box>
            {onSearch && (
                <Box sx={{ mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        inputProps={{
                            'aria-label': 'Search table data',
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} aria-hidden="true" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            maxWidth: 400,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                '& fieldset': {
                                    borderColor: 'rgba(0,0,0,0.1)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(0,0,0,0.2)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                }
                            }
                        }}
                    />
                </Box>
            )}

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table aria-label={ariaLabel}>
                    <caption style={{ display: 'none' }}>{ariaLabel}</caption>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id || column.field}
                                    scope="col"
                                    sx={{
                                        fontWeight: 600,
                                        ...column.headerSx,
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <SkeletonTable rows={5} columns={columns.length} />
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" role="status" aria-live="polite">
                                    <Box sx={{ py: 8 }}>
                                        <EmptyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} aria-hidden="true" />
                                        <Typography variant="body1" color="text.secondary">
                                            {emptyMessage}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow
                                    key={row.id || index}
                                    sx={{
                                        '&:hover': { bgcolor: 'action.hover' },
                                        '&:last-child td': { borderBottom: 0 }
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.id || column.field}>
                                            {column.render ? column.render(row) : row[column.id || column.field]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pagination && (
                <TablePagination
                    component="div"
                    count={pagination.total || 0}
                    page={(pagination.page || 1) - 1}
                    onPageChange={handlePageChange}
                    rowsPerPage={pagination.limit || 20}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    sx={{ mt: 2 }}
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
                />
            )}
        </Box>
    );
}
