import express from 'express';
import { asyncHandler } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

/**
 * POST /api/variance-analysis/calculate/:productionLogId
 * Calculate variance for a production log
 */
router.post('/calculate/:productionLogId', asyncHandler(async (req, res) => {
    const productionLogId = parseInt(req.params.productionLogId);

    // Get production log with details
    const productionLog = await prisma.productionLog.findUnique({
        where: { id: productionLogId },
        include: {
            menuItem: true,
            details: true
        }
    });

    if (!productionLog) {
        return res.status(404).json({ error: 'Production log not found' });
    }

    // Get cost standard for this menu item
    const costStandard = await prisma.costStandard.findFirst({
        where: { menuItemId: productionLog.menuItemId },
        orderBy: { effectiveDate: 'desc' }
    });

    if (!costStandard) {
        return res.status(404).json({ error: 'Cost standard not found. Please calculate cost standard first.' });
    }

    // Calculate actual costs
    const actualMaterialCost = productionLog.details.reduce((sum, detail) => sum + detail.subtotal, 0);

    // Get labor rate
    const settings = await prisma.businessSettings.findFirst();
    const laborRate = settings?.laborRatePerHour || 0;
    const actualLaborCost = (productionLog.laborHoursActual || 0) * laborRate;

    // Calculate overhead (using same method as cost standard)
    const overheadConfig = await prisma.overheadConfig.findFirst({
        orderBy: { effectiveDate: 'desc' }
    });

    let actualOverheadCost = 0;
    if (overheadConfig) {
        if (overheadConfig.allocationMethod === 'percentage_labor') {
            actualOverheadCost = actualLaborCost * (overheadConfig.allocationRate / 100);
        } else if (overheadConfig.allocationMethod === 'percentage_material') {
            actualOverheadCost = actualMaterialCost * (overheadConfig.allocationRate / 100);
        } else if (overheadConfig.allocationMethod === 'per_unit') {
            actualOverheadCost = overheadConfig.allocationRate * productionLog.portionsProduced;
        }
    }

    const actualTotalCost = actualMaterialCost + actualLaborCost + actualOverheadCost;

    // Calculate standard cost for produced portions
    const standardTotalCost = costStandard.costPerPortion * productionLog.portionsProduced;

    // Calculate variances
    const totalVariance = actualTotalCost - standardTotalCost;
    const variancePercentage = standardTotalCost > 0 ? (totalVariance / standardTotalCost) * 100 : 0;

    // Save variance record
    const varianceRecord = await prisma.varianceRecord.create({
        data: {
            menuItemId: productionLog.menuItemId,
            productionLogId: productionLog.id,
            varianceDate: productionLog.productionDate,
            standardCost: standardTotalCost,
            actualCost: actualTotalCost,
            varianceAmount: totalVariance,
            variancePercentage,
            varianceType: 'material_price', // Simplified for now
            notes: `Variance for ${productionLog.portionsProduced} portions`
        }
    });

    res.json({
        varianceRecord,
        analysis: {
            standardCost: Math.round(standardTotalCost * 100) / 100,
            actualCost: Math.round(actualTotalCost * 100) / 100,
            variance: Math.round(totalVariance * 100) / 100,
            variancePercentage: Math.round(variancePercentage * 100) / 100,
            breakdown: {
                material: {
                    standard: Math.round(costStandard.materialCost * productionLog.portionsProduced * 100) / 100,
                    actual: Math.round(actualMaterialCost * 100) / 100,
                    variance: Math.round((actualMaterialCost - costStandard.materialCost * productionLog.portionsProduced) * 100) / 100
                },
                labor: {
                    standard: Math.round(costStandard.laborCost * productionLog.portionsProduced * 100) / 100,
                    actual: Math.round(actualLaborCost * 100) / 100,
                    variance: Math.round((actualLaborCost - costStandard.laborCost * productionLog.portionsProduced) * 100) / 100
                },
                overhead: {
                    standard: Math.round(costStandard.overheadCost * productionLog.portionsProduced * 100) / 100,
                    actual: Math.round(actualOverheadCost * 100) / 100,
                    variance: Math.round((actualOverheadCost - costStandard.overheadCost * productionLog.portionsProduced) * 100) / 100
                }
            }
        }
    });
}));

/**
 * GET /api/variance-analysis/summary
 * Get variance summary for a date range
 */
router.get('/summary', asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const where = {
        ...(startDate || endDate ? {
            varianceDate: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) })
            }
        } : {})
    };

    const variances = await prisma.varianceRecord.findMany({
        where,
        include: {
            menuItem: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    const totalVariance = variances.reduce((sum, v) => sum + v.varianceAmount, 0);
    const averageVariancePercentage = variances.length > 0
        ? variances.reduce((sum, v) => sum + v.variancePercentage, 0) / variances.length
        : 0;

    const favorableCount = variances.filter(v => v.varianceAmount < 0).length;
    const unfavorableCount = variances.filter(v => v.varianceAmount > 0).length;

    res.json({
        totalVariance: Math.round(totalVariance * 100) / 100,
        averageVariancePercentage: Math.round(averageVariancePercentage * 100) / 100,
        favorableCount,
        unfavorableCount,
        totalRecords: variances.length,
        variances: variances.slice(0, 10) // Last 10 for summary
    });
}));

/**
 * GET /api/variance-analysis/:menuItemId
 * Get variance records for a menu item
 */
router.get('/:menuItemId', asyncHandler(async (req, res) => {
    const menuItemId = parseInt(req.params.menuItemId);

    const variances = await prisma.varianceRecord.findMany({
        where: { menuItemId },
        orderBy: { varianceDate: 'desc' },
        take: 20,
        include: {
            menuItem: {
                select: {
                    id: true,
                    name: true,
                    code: true
                }
            }
        }
    });

    res.json(variances);
}));

export default router;
