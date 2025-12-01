import express from 'express';
import Joi from 'joi';
import { asyncHandler, validate, validateQuery } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

// Validation schemas
const menuSchema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    category: Joi.string().allow('', null),
    standardPortion: Joi.number().integer().min(1).required(),
    standardPortionUnit: Joi.string().required(),
    standardLaborHours: Joi.number().min(0).default(0),
    isActive: Joi.boolean()
});

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().allow(''),
    category: Joi.string().allow(''),
    isActive: Joi.boolean()
});

/**
 * GET /api/menu-items
 * List all menu items
 */
router.get('/', validateQuery(querySchema), asyncHandler(async (req, res) => {
    const { page, limit, search, category, isActive } = req.validatedQuery;
    const skip = (page - 1) * limit;

    const where = {
        ...(search && {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } }
            ]
        }),
        ...(category && { category }),
        ...(isActive !== undefined && { isActive })
    };

    const [menuItems, total] = await Promise.all([
        prisma.menuItem.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { recipeDetails: true }
                }
            }
        }),
        prisma.menuItem.count({ where })
    ]);

    res.json({
        data: menuItems,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
}));

/**
 * GET /api/menu-items/:id
 * Get single menu item with recipe details
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const menuItem = await prisma.menuItem.findUnique({
        where: { id },
        include: {
            recipeDetails: {
                include: {
                    rawMaterial: {
                        include: {
                            supplier: {
                                select: { id: true, name: true }
                            }
                        }
                    }
                },
                orderBy: { sequence: 'asc' }
            },
            costStandards: {
                orderBy: { effectiveDate: 'desc' },
                take: 1
            },
            menuPricing: {
                orderBy: { effectiveDate: 'desc' },
                take: 1
            }
        }
    });

    if (!menuItem) {
        return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(menuItem);
}));

/**
 * POST /api/menu-items
 * Create new menu item
 */
router.post('/', validate(menuSchema), asyncHandler(async (req, res) => {
    // Check if code already exists
    const existing = await prisma.menuItem.findUnique({
        where: { code: req.validatedData.code }
    });

    if (existing) {
        return res.status(400).json({ error: 'Menu item code already exists' });
    }

    const menuItem = await prisma.menuItem.create({
        data: req.validatedData
    });

    res.status(201).json(menuItem);
}));

/**
 * PUT /api/menu-items/:id
 * Update menu item
 */
router.put('/:id', validate(menuSchema), asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    // Check if code already exists (excluding current item)
    if (req.validatedData.code) {
        const existing = await prisma.menuItem.findFirst({
            where: {
                code: req.validatedData.code,
                NOT: { id }
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Menu item code already exists' });
        }
    }

    const menuItem = await prisma.menuItem.update({
        where: { id },
        data: req.validatedData
    });

    res.json(menuItem);
}));

/**
 * DELETE /api/menu-items/:id
 * Delete menu item
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    // Check if menu item has production logs
    const productionCount = await prisma.productionLog.count({
        where: { menuItemId: id }
    });

    if (productionCount > 0) {
        // Soft delete
        await prisma.menuItem.update({
            where: { id },
            data: { isActive: false }
        });
    } else {
        // Hard delete (will cascade to recipe details)
        await prisma.menuItem.delete({
            where: { id }
        });
    }

    res.json({ message: 'Menu item deleted successfully' });
}));

/**
 * GET /api/menu-items/categories/list
 * Get unique categories
 */
router.get('/categories/list', asyncHandler(async (req, res) => {
    const menuItems = await prisma.menuItem.findMany({
        where: {
            category: { not: null },
            isActive: true
        },
        select: { category: true },
        distinct: ['category']
    });

    const categories = menuItems
        .map(m => m.category)
        .filter(Boolean)
        .sort();

    res.json(categories);
}));

export default router;
