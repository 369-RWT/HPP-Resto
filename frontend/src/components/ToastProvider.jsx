import React from 'react';
import { SnackbarProvider } from 'notistack';
import { styled } from '@mui/material/styles';

// Styled wrapper for Apple-inspired toast styling
const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
    '&.SnackbarItem-variantSuccess': {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        borderRadius: '12px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(52, 199, 89, 0.3)',
    },
    '&.SnackbarItem-variantError': {
        backgroundColor: theme.palette.error.main,
        color: '#fff',
        borderRadius: '12px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
    },
    '&.SnackbarItem-variantWarning': {
        backgroundColor: theme.palette.warning.main,
        color: '#fff',
        borderRadius: '12px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(255, 149, 0, 0.3)',
    },
    '&.SnackbarItem-variantInfo': {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        borderRadius: '12px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
    },
}));

const ToastProvider = ({ children }) => {
    return (
        <StyledSnackbarProvider
            maxSnack={3}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            autoHideDuration={4000}
            style={{
                borderRadius: '12px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto',
            }}
        >
            {children}
        </StyledSnackbarProvider>
    );
};

export default ToastProvider;
