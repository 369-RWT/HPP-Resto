import express from 'express';
import Joi from 'joi';
import { asyncHandler, validate, validateQuery } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

// Validation schemas
const yieldTestSchema = Joi.object({
    rawMaterialId: Joi.number().integer().required(),
    testDate: Joi.date().required(),
    apWeight: Joi.number().min(0).required(), // As Purchased
    epWeight: Joi.number().min(0).required(), // Edible Portion
    notes: Joi.string().allow('', null)
});

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    rawMaterialId: Joi.number().integer(),
    startDate: Joi.date(),
    endDate: Joi.date()
});

/**
 * GET /api/yield-tests
 * List yield tests
 */
router.get('/', validateQuery(querySchema), asyncHandler(async (req, res) => {
    const { page, limit, rawMaterialId, startDate, endDate } = req.validatedQuery;
    const skip = (page - 1) * limit;

    const where = {
        ...(rawMaterialId && { rawMaterialId }),
        ...(startDate || endDate ? {
            testDate: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) })
            }
        } : {})
    };

    const [tests, total] = await Promise.all([
        prisma.yieldTest.findMany({
            where,
            skip,
            take: limit,
            orderBy: { testDate: 'desc' },
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
        }),
        prisma.yieldTest.count({ where })
    ]);

    res.json({
        data: tests,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
}));

/**
 * GET /api/yield-tests/:id
 * Get single yield test
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const test = await prisma.yieldTest.findUnique({
        where: { id },
        include: {
            rawMaterial: true
        }
    });

    if (!test) {
        return res.status(404).json({ error: 'Yield test not found' });
    }

    res.json(test);
}));

/**
 * POST /api/yield-tests
 * Create yield test
 */
router.post('/', validate(yieldTestSchema), asyncHandler(async (req, res) => {
    const { apWeight, epWeight, ...otherData } = req.validatedData;

    // Calculate yield percentage
    const yieldPercentage = (epWeight / apWeight) * 100;

    const test = await prisma.yieldTest.create({
        data: {
            ...otherData,
            apWeight,
            epWeight,
            yieldPercentage
        },
        include: {
            rawMaterial: true
        }
    });

    // Update material's yield percentage with latest test
    await prisma.rawMaterial.update({
        where: { id: test.rawMaterialId },
        data: { yieldPercentage }
    });

    res.status(201).json(test);
}));

/**
 * PUT /api/yield-tests/:id
 * Update yield test
 */
router.put('/:id', validate(yieldTestSchema), asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { apWeight, epWeight, ...otherData } = req.validatedData;

    // Calculate yield percentage
    const yieldPercentage = (epWeight / apWeight) * 100;

    const test = await prisma.yieldTest.update({
        where: { id },
        data: {
            ...otherData,
            apWeight,
            epWeight,
            yieldPercentage
        },
        include: {
            rawMaterial: true
        }
    });

    res.json(test);
}));

/**
 * DELETE /api/yield-tests/:id
 * Delete yield test
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    await prisma.yieldTest.delete({
        where: { id }
    });

    res.json({ message: 'Yield test deleted successfully' });
}));

/**
 * GET /api/yield-tests/material/:materialId/average
 * Get average yield for a material
 */
router.get('/material/:materialId/average', asyncHandler(async (req, res) => {
    const materialId = parseInt(req.params.materialId);

    const tests = await prisma.yieldTest.findMany({
        where: { rawMaterialId: materialId },
        orderBy: { testDate: 'desc' },
        take: 10 // Last 10 tests
    });

    if (tests.length === 0) {
        return res.json({
            averageYield: 100,
            testCount: 0
        });
    }

    const averageYield = tests.reduce((sum, test) => sum + test.yieldPercentage, 0) / tests.length;

    res.json({
        averageYield: Math.round(averageYield * 100) / 100,
        testCount: tests.length,
        latestYield: tests[0].yieldPercentage
    });
}));

export default router;
