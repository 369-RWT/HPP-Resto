import { useSnackbar } from 'notistack';

/**
 * Custom hook for toast notifications
 * Provides consistent API for showing success, error, warning, and info messages
 * 
 * @returns {Object} Toast notification methods
 */
const useToast = () => {
    const { enqueueSnackbar } = useSnackbar();

    const toast = {
        success: (message) => {
            enqueueSnackbar(message, {
                variant: 'success',
                'aria-live': 'polite',
                'aria-atomic': 'true',
            });
        },

        error: (message) => {
            enqueueSnackbar(message, {
                variant: 'error',
                'aria-live': 'assertive',
                'aria-atomic': 'true',
            });
        },

        warning: (message) => {
            enqueueSnackbar(message, {
                variant: 'warning',
                'aria-live': 'polite',
                'aria-atomic': 'true',
            });
        },

        info: (message) => {
            enqueueSnackbar(message, {
                variant: 'info',
                'aria-live': 'polite',
                'aria-atomic': 'true',
            });
        },
    };

    return toast;
};

export default useToast;
