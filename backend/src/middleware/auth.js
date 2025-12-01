/**
 * Simple auth middleware for single-user application
 * Checks for basic API key in headers
 */
export const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const expectedKey = process.env.APP_SECRET;

    // For single-user app, we allow all requests or simple key check
    // This can be enhanced later if needed
    if (process.env.NODE_ENV === 'development') {
        // In development, allow all requests
        next();
    } else if (apiKey === expectedKey) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

/**
 * Optional auth - doesn't block if no key provided
 */
export const optionalAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    req.isAuthenticated = apiKey === process.env.APP_SECRET;
    next();
};
