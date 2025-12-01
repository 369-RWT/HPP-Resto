import express from 'express';
import { asyncHandler } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

/**
 * GET /api/reports/menu-profitability
 * Menu profitability analysis
 */
router.get('/menu-profitability', asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    // Get all menu items with their latest cost standard and pricing
    const menuItems = await prisma.menuItem.findMany({
        where: { isActive: true },
        include: {
            costStandards: {
                orderBy: { effectiveDate: 'desc' },
                take: 1
            },
            menuPricing: {
                orderBy: { effectiveDate: 'desc' },
                take: 1
            },
            productionLogs: {
                where: {
                    ...(startDate || endDate ? {
                        productionDate: {
                            ...(startDate && { gte: new Date(startDate) }),
                            ...(endDate && { lte: new Date(endDate) })
                        }
                    } : {})
                }
            }
        }
    });

    const profitability = menuItems.map(item => {
        const costStandard = item.costStandards[0];
        const pricing = item.menuPricing[0];
        const totalSold = item.productionLogs.reduce((sum, log) => sum + (log.portionsSold || 0), 0);

        const costPerPortion = costStandard?.costPerPortion || 0;
        const sellingPrice = pricing?.sellingPrice || 0;
        const margin = sellingPrice - costPerPortion;
        const marginPercentage = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0;
        const totalRevenue = totalSold * sellingPrice;
        const totalCost = totalSold * costPerPortion;
        const totalProfit = totalRevenue - totalCost;

        return {
            menuItemId: item.id,
            menuName: item.name,
            category: item.category,
            totalSold,
            costPerPortion: Math.round(costPerPortion * 100) / 100,
            sellingPrice: Math.round(sellingPrice * 100) / 100,
            margin: Math.round(margin * 100) / 100,
            marginPercentage: Math.round(marginPercentage * 100) / 100,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            totalCost: Math.round(totalCost * 100) / 100,
            totalProfit: Math.round(totalProfit * 100) / 100
        };
    }).filter(item => item.totalSold > 0); // Only items with sales

    res.json(profitability.sort((a, b) => b.totalProfit - a.totalProfit));
}));

/**
 * GET /api/reports/cost-trends
 * Cost trends over time for a menu item or all items
 */
router.get('/cost-trends', asyncHandler(async (req, res) => {
    const { startDate, endDate, menuItemId } = req.query;

    const where = {
        ...(menuItemId && { menuItemId: parseInt(menuItemId) }),
        ...(startDate || endDate ? {
            effectiveDate: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) })
            }
        } : {})
    };

    const costStandards = await prisma.costStandard.findMany({
        where,
        orderBy: { effectiveDate: 'asc' },
        include: {
            menuItem: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    // Group by date
    const trendData = costStandards.reduce((acc, cost) => {
        const date = cost.effectiveDate.toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = {
                date,
                costs: [],
                avgTotalCost: 0,
                avgMaterialCost: 0,
                avgLaborCost: 0,
                avgOverheadCost: 0
            };
        }
        acc[date].costs.push(cost);
        return acc;
    }, {});

    // Calculate averages
    const trends = Object.values(trendData).map(day => {
        const count = day.costs.length;
        return {
            date: day.date,
            averageTotalCost: Math.round((day.costs.reduce((sum, c) => sum + c.totalCost, 0) / count) * 100) / 100,
            averageMaterialCost: Math.round((day.costs.reduce((sum, c) => sum + c.materialCost, 0) / count) * 100) / 100,
            averageLaborCost: Math.round((day.costs.reduce((sum, c) => sum + c.laborCost, 0) / count) * 100) / 100,
            averageOverheadCost: Math.round((day.costs.reduce((sum, c) => sum + c.overheadCost, 0) / count) * 100) / 100,
            recordCount: count
        };
    });

    res.json(trends);
}));

/**
 * GET /api/reports/monthly-summary
 * Monthly summary report
 */
router.get('/monthly-summary', asyncHandler(async (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ error: 'Month and year are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get all production logs for the period
    const productionLogs = await prisma.productionLog.findMany({
        where: {
            productionDate: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            menuItem: {
                include: {
                    menuPricing: {
                        orderBy: { effectiveDate: 'desc' },
                        take: 1
                    }
                }
            },
            details: true
        }
    });

    // Calculate totals
    let totalRevenue = 0;
    let totalMaterialCost = 0;
    let totalLaborCost = 0;
    let totalOverheadCost = 0;

    const settings = await prisma.businessSettings.findFirst();
    const laborRate = settings?.laborRatePerHour || 0;

    for (const log of productionLogs) {
        const pricing = log.menuItem.menuPricing[0];
        const sellingPrice = pricing?.sellingPrice || 0;
        const portionsSold = log.portionsSold || 0;

        totalRevenue += portionsSold * sellingPrice;
        totalMaterialCost += log.details.reduce((sum, detail) => sum + detail.subtotal, 0);
        totalLaborCost += (log.laborHoursActual || 0) * laborRate;
    }

    // Simple overhead calculation
    const overheadConfig = await prisma.overheadConfig.findFirst({
        orderBy: { effectiveDate: 'desc' }
    });

    if (overheadConfig) {
        if (overheadConfig.allocationMethod === 'percentage_labor') {
            totalOverheadCost = totalLaborCost * (overheadConfig.allocationRate / 100);
        } else if (overheadConfig.allocationMethod === 'percentage_material') {
            totalOverheadCost = totalMaterialCost * (overheadConfig.allocationRate / 100);
        }
    }

    const totalCost = totalMaterialCost + totalLaborCost + totalOverheadCost;
    const netProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    res.json({
        period: `${month}/${year}`,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
        totalLaborCost: Math.round(totalLaborCost * 100) / 100,
        totalOverheadCost: Math.round(totalOverheadCost * 100) / 100,
        foodCostPercentage: totalRevenue > 0 ? Math.round((totalMaterialCost / totalRevenue) * 100 * 100) / 100 : 0,
        laborCostPercentage: totalRevenue > 0 ? Math.round((totalLaborCost / totalRevenue) * 100 * 100) / 100 : 0,
        overheadCostPercentage: totalRevenue > 0 ? Math.round((totalOverheadCost / totalRevenue) * 100 * 100) / 100 : 0,
        netProfit: Math.round(netProfit * 100) / 100,
        profitMargin: Math.round(profitMargin * 100) / 100,
        productionCount: productionLogs.length
    });
}));

/**
 * GET /api/reports/dashboard
 * Dashboard summary
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
    // Get counts
    const [
        suppliersCount,
        materialsCount,
        menuItemsCount,
        recentProduction
    ] = await Promise.all([
        prisma.supplier.count({ where: { isActive: true } }),
        prisma.rawMaterial.count({ where: { isActive: true } }),
        prisma.menuItem.count({ where: { isActive: true } }),
        prisma.productionLog.count({
            where: {
                productionDate: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            }
        })
    ]);

    // Get recent variance summary
    const recentVariances = await prisma.varianceRecord.findMany({
        orderBy: { varianceDate: 'desc' },
        take: 10
    });

    const avgVariance = recentVariances.length > 0
        ? recentVariances.reduce((sum, v) => sum + v.variancePercentage, 0) / recentVariances.length
        : 0;

    res.json({
        counts: {
            suppliers: suppliersCount,
            materials: materialsCount,
            menuItems: menuItemsCount,
            recentProduction
        },
        variance: {
            average: Math.round(avgVariance * 100) / 100,
            recentCount: recentVariances.length
        }
    });
}));

export default router;
