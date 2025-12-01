import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

/**
 * Reusable confirmation dialog with accessibility support
 * @param {Boolean} open - Dialog open state
 * @param {Function} onClose - Close handler
 * @param {Function} onConfirm - Confirm handler
 * @param {String} title - Dialog title
 * @param {String} message - Dialog message
 * @param {String} confirmText - Confirm button text
 * @param {String} cancelText - Cancel button text
 * @param {Boolean} danger - Whether this is a dangerous action (uses error color)
 */
export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
}) {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            onClose();
        } else if (event.key === 'Enter' && !danger) {
            // Only auto-confirm on Enter for non-dangerous actions
            onConfirm();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            onKeyDown={handleKeyDown}
            maxWidth="xs"
            fullWidth
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 600 }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    aria-label={cancelText}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={danger ? 'error' : 'primary'}
                    autoFocus
                    aria-label={confirmText}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
