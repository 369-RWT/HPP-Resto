import express from 'express';
import Joi from 'joi';
import { asyncHandler, validate, validateQuery } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

// Validation schemas
const materialSchema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    unit: Joi.string().required(),
    category: Joi.string().allow('', null),
    currentPrice: Joi.number().min(0).required(),
    yieldPercentage: Joi.number().min(0).max(100).default(100),
    supplierId: Joi.number().integer().allow(null),
    notes: Joi.string().allow('', null),
    isActive: Joi.boolean()
});

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().allow(''),
    category: Joi.string().allow(''),
    supplierId: Joi.number().integer(),
    isActive: Joi.boolean()
});

/**
 * GET /api/materials
 * List all raw materials
 */
router.get('/', validateQuery(querySchema), asyncHandler(async (req, res) => {
    const { page, limit, search, category, supplierId, isActive } = req.validatedQuery;
    const skip = (page - 1) * limit;

    const where = {
        ...(search && {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } }
            ]
        }),
        ...(category && { category }),
        ...(supplierId && { supplierId }),
        ...(isActive !== undefined && { isActive })
    };

    const [materials, total] = await Promise.all([
        prisma.rawMaterial.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        }),
        prisma.rawMaterial.count({ where })
    ]);

    res.json({
        data: materials,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
}));

/**
 * GET /api/materials/:id
 * Get single material
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const material = await prisma.rawMaterial.findUnique({
        where: { id },
        include: {
            supplier: true,
            yieldTests: {
                orderBy: { testDate: 'desc' },
                take: 5
            }
        }
    });

    if (!material) {
        return res.status(404).json({ error: 'Material not found' });
    }

    res.json(material);
}));

/**
 * POST /api/materials
 * Create new material
 */
router.post('/', validate(materialSchema), asyncHandler(async (req, res) => {
    // Check if code already exists
    const existing = await prisma.rawMaterial.findUnique({
        where: { code: req.validatedData.code }
    });

    if (existing) {
        return res.status(400).json({ error: 'Material code already exists' });
    }

    const material = await prisma.rawMaterial.create({
        data: req.validatedData,
        include: {
            supplier: true
        }
    });

    res.status(201).json(material);
}));

/**
 * PUT /api/materials/:id
 * Update material
 */
router.put('/:id', validate(materialSchema), asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    // Check if code already exists (excluding current material)
    if (req.validatedData.code) {
        const existing = await prisma.rawMaterial.findFirst({
            where: {
                code: req.validatedData.code,
                NOT: { id }
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Material code already exists' });
        }
    }

    const material = await prisma.rawMaterial.update({
        where: { id },
        data: req.validatedData,
        include: {
            supplier: true
        }
    });

    res.json(material);
}));

/**
 * DELETE /api/materials/:id
 * Delete material
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    // Check if material is used in recipes
    const recipeCount = await prisma.recipeDetail.count({
        where: { rawMaterialId: id }
    });

    if (recipeCount > 0) {
        // Soft delete
        await prisma.rawMaterial.update({
            where: { id },
            data: { isActive: false }
        });
    } else {
        // Hard delete
        await prisma.rawMaterial.delete({
            where: { id }
        });
    }

    res.json({ message: 'Material deleted successfully' });
}));

/**
 * GET /api/materials/categories/list
 * Get unique categories
 */
router.get('/categories/list', asyncHandler(async (req, res) => {
    const materials = await prisma.rawMaterial.findMany({
        where: {
            category: { not: null },
            isActive: true
        },
        select: { category: true },
        distinct: ['category']
    });

    const categories = materials
        .map(m => m.category)
        .filter(Boolean)
        .sort();

    res.json(categories);
}));

export default router;
