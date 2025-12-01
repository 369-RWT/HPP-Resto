import express from 'express';
import Joi from 'joi';
import { asyncHandler, validate, validateQuery } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

// Validation schemas
const productionLogSchema = Joi.object({
    menuItemId: Joi.number().integer().required(),
    productionDate: Joi.date().required(),
    portionsProduced: Joi.number().integer().min(1).required(),
    portionsSold: Joi.number().integer().min(0).allow(null),
    laborHoursActual: Joi.number().min(0).allow(null),
    notes: Joi.string().allow('', null)
});

const productionDetailSchema = Joi.object({
    rawMaterialId: Joi.number().integer().required(),
    quantityUsed: Joi.number().min(0).required(),
    unit: Joi.string().required(),
    unitPrice: Joi.number().min(0).required()
});

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    menuItemId: Joi.number().integer(),
    startDate: Joi.date(),
    endDate: Joi.date()
});

/**
 * GET /api/production-logs
 * List production logs
 */
router.get('/', validateQuery(querySchema), asyncHandler(async (req, res) => {
    const { page, limit, menuItemId, startDate, endDate } = req.validatedQuery;
    const skip = (page - 1) * limit;

    const where = {
        ...(menuItemId && { menuItemId }),
        ...(startDate || endDate ? {
            productionDate: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) })
            }
        } : {})
    };

    const [logs, total] = await Promise.all([
        prisma.productionLog.findMany({
            where,
            skip,
            take: limit,
            orderBy: { productionDate: 'desc' },
            include: {
                menuItem: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        category: true
                    }
                },
                _count: {
                    select: { details: true }
                }
            }
        }),
        prisma.productionLog.count({ where })
    ]);

    res.json({
        data: logs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
}));

/**
 * GET /api/production-logs/:id
 * Get single production log with details
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const log = await prisma.productionLog.findUnique({
        where: { id },
        include: {
            menuItem: true,
            details: {
                include: {
                    rawMaterial: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            unit: true
                        }
                    }
                }
            }
        }
    });

    if (!log) {
        return res.status(404).json({ error: 'Production log not found' });
    }

    res.json(log);
}));

/**
 * POST /api/production-logs
 * Create production log
 */
router.post('/', validate(productionLogSchema), asyncHandler(async (req, res) => {
    const log = await prisma.productionLog.create({
        data: req.validatedData,
        include: {
            menuItem: true
        }
    });

    res.status(201).json(log);
}));

/**
 * PUT /api/production-logs/:id
 * Update production log
 */
router.put('/:id', validate(productionLogSchema), asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const log = await prisma.productionLog.update({
        where: { id },
        data: req.validatedData,
        include: {
            menuItem: true
        }
    });

    res.json(log);
}));

/**
 * DELETE /api/production-logs/:id
 * Delete production log
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    await prisma.productionLog.delete({
        where: { id }
    });

    res.json({ message: 'Production log deleted successfully' });
}));

/**
 * POST /api/production-logs/:id/details
 * Add material usage to production log
 */
router.post('/:id/details', validate(productionDetailSchema), asyncHandler(async (req, res) => {
    const productionLogId = parseInt(req.params.id);
    const { quantityUsed, unitPrice, ...otherData } = req.validatedData;

    const subtotal = quantityUsed * unitPrice;

    const detail = await prisma.productionLogDetail.create({
        data: {
            productionLogId,
            ...otherData,
            quantityUsed,
            unitPrice,
            subtotal
        },
        include: {
            rawMaterial: true
        }
    });

    res.status(201).json(detail);
}));

/**
 * PUT /api/production-logs/:id/details/:detailId
 * Update material usage
 */
router.put('/:id/details/:detailId', validate(productionDetailSchema), asyncHandler(async (req, res) => {
    const detailId = parseInt(req.params.detailId);
    const { quantityUsed, unitPrice, ...otherData } = req.validatedData;

    const subtotal = quantityUsed * unitPrice;

    const detail = await prisma.productionLogDetail.update({
        where: { id: detailId },
        data: {
            ...otherData,
            quantityUsed,
            unitPrice,
            subtotal
        },
        include: {
            rawMaterial: true
        }
    });

    res.json(detail);
}));

/**
 * DELETE /api/production-logs/:id/details/:detailId
 * Remove material usage
 */
router.delete('/:id/details/:detailId', asyncHandler(async (req, res) => {
    const detailId = parseInt(req.params.detailId);

    await prisma.productionLogDetail.delete({
        where: { id: detailId }
    });

    res.json({ message: 'Material usage removed' });
}));

export default router;
