import express from 'express';
import { asyncHandler } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

/**
 * GET /api/auth/status
 * Check if application is initialized
 */
router.get('/status', asyncHandler(async (req, res) => {
    const settings = await prisma.businessSettings.findFirst();

    res.json({
        initialized: settings?.isInitialized || false,
        businessName: settings?.businessName || null
    });
}));

/**
 * POST /api/auth/init
 * Initialize application with business settings
 */
router.post('/init', asyncHandler(async (req, res) => {
    const { businessName, address, phone, email, laborRatePerHour } = req.body;

    // Check if already initialized
    const existing = await prisma.businessSettings.findFirst();
    if (existing?.isInitialized) {
        return res.status(400).json({ error: 'Application already initialized' });
    }

    // Create or update business settings
    const settings = await prisma.businessSettings.upsert({
        where: { id: existing?.id || 0 },
        update: {
            businessName,
            address,
            phone,
            email,
            laborRatePerHour: laborRatePerHour || 0,
            isInitialized: true
        },
        create: {
            businessName,
            address,
            phone,
            email,
            laborRatePerHour: laborRatePerHour || 0,
            isInitialized: true
        }
    });

    res.status(201).json({
        message: 'Application initialized successfully',
        settings: {
            businessName: settings.businessName,
            email: settings.email
        }
    });
}));

/**
 * GET /api/auth/settings
 * Get business settings
 */
router.get('/settings', asyncHandler(async (req, res) => {
    const settings = await prisma.businessSettings.findFirst();

    if (!settings) {
        return res.status(404).json({ error: 'Business settings not found' });
    }

    res.json(settings);
}));

/**
 * PUT /api/auth/settings
 * Update business settings
 */
router.put('/settings', asyncHandler(async (req, res) => {
    const { businessName, address, phone, email, laborRatePerHour, currency } = req.body;

    const settings = await prisma.businessSettings.findFirst();

    if (!settings) {
        return res.status(404).json({ error: 'Business settings not found. Please initialize first.' });
    }

    const updated = await prisma.businessSettings.update({
        where: { id: settings.id },
        data: {
            ...(businessName && { businessName }),
            ...(address !== undefined && { address }),
            ...(phone !== undefined && { phone }),
            ...(email !== undefined && { email }),
            ...(laborRatePerHour !== undefined && { laborRatePerHour }),
            ...(currency && { currency })
        }
    });

    res.json({
        message: 'Settings updated successfully',
        settings: updated
    });
}));

export default router;
