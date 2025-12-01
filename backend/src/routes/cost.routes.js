import express from 'express';
import { asyncHandler } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

/**
 * POST /api/cost-standards/calculate/:menuItemId
 * Calculate cost standard for a menu item
 */
router.post('/calculate/:menuItemId', asyncHandler(async (req, res) => {
    const menuItemId = parseInt(req.params.menuItemId);

    // Get menu item with recipe details
    const menuItem = await prisma.menuItem.findUnique({
        where: { id: menuItemId },
        include: {
            recipeDetails: {
                include: {
                    rawMaterial: true
                }
            }
        }
    });

    if (!menuItem) {
        return res.status(404).json({ error: 'Menu item not found' });
    }

    // Calculate material cost
    let materialCost = 0;
    for (const detail of menuItem.recipeDetails) {
        const material = detail.rawMaterial;
        const yieldAdjustedPrice = material.currentPrice / (material.yieldPercentage / 100);
        const itemCost = detail.quantity * yieldAdjustedPrice;
        materialCost += itemCost;
    }

    // Get business settings for labor rate
    const settings = await prisma.businessSettings.findFirst();
    const laborRate = settings?.laborRatePerHour || 0;

    // Calculate labor cost
    const laborCost = (menuItem.standardLaborHours || 0) * laborRate;

    // Get overhead configuration
    const overheadConfig = await prisma.overheadConfig.findFirst({
        orderBy: { effectiveDate: 'desc' }
    });

    let overheadCost = 0;
    if (overheadConfig) {
        if (overheadConfig.allocationMethod === 'percentage_labor') {
            overheadCost = laborCost * (overheadConfig.allocationRate / 100);
        } else if (overheadConfig.allocationMethod === 'percentage_material') {
            overheadCost = materialCost * (overheadConfig.allocationRate / 100);
        } else if (overheadConfig.allocationMethod === 'per_unit') {
            overheadCost = overheadConfig.allocationRate;
        }
    }

    // Total cost
    const totalCost = materialCost + laborCost + overheadCost;
    const costPerPortion = totalCost / menuItem.standardPortion;

    // Save cost standard
    const costStandard = await prisma.costStandard.create({
        data: {
            menuItemId,
            effectiveDate: new Date(),
            materialCost,
            laborCost,
            overheadCost,
            totalCost,
            costPerPortion
        }
    });

    res.json({
        costStandard,
        breakdown: {
            materialCost: Math.round(materialCost * 100) / 100,
            laborCost: Math.round(laborCost * 100) / 100,
            overheadCost: Math.round(overheadCost * 100) / 100,
            totalCost: Math.round(totalCost * 100) / 100,
            costPerPortion: Math.round(costPerPortion * 100) / 100,
            standardPortion: menuItem.standardPortion
        }
    });
}));

/**
 * GET /api/cost-standards/:menuItemId
 * Get latest cost standard for menu item
 */
router.get('/:menuItemId', asyncHandler(async (req, res) => {
    const menuItemId = parseInt(req.params.menuItemId);

    const costStandard = await prisma.costStandard.findFirst({
        where: { menuItemId },
        orderBy: { effectiveDate: 'desc' },
        include: {
            menuItem: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                    standardPortion: true
                }
            }
        }
    });

    if (!costStandard) {
        return res.status(404).json({ error: 'Cost standard not found' });
    }

    res.json(costStandard);
}));

/**
 * GET /api/cost-standards/:menuItemId/history
 * Get cost standard history
 */
router.get('/:menuItemId/history', asyncHandler(async (req, res) => {
    const menuItemId = parseInt(req.params.menuItemId);

    const history = await prisma.costStandard.findMany({
        where: { menuItemId },
        orderBy: { effectiveDate: 'desc' },
        take: 20
    });

    res.json(history);
}));

/**
 * GET /api/cost-standards/overhead/config
 * Get overhead configuration
 */
router.get('/overhead/config', asyncHandler(async (req, res) => {
    const config = await prisma.overheadConfig.findFirst({
        orderBy: { effectiveDate: 'desc' }
    });

    res.json(config || {});
}));

/**
 * POST /api/cost-standards/overhead/config
 * Create or update overhead configuration
 */
router.post('/overhead/config', asyncHandler(async (req, res) => {
    const { allocationMethod, allocationRate, notes } = req.body;

    const config = await prisma.overheadConfig.create({
        data: {
            allocationMethod,
            allocationRate,
            effectiveDate: new Date(),
            notes
        }
    });

    res.status(201).json(config);
}));

export default router;
