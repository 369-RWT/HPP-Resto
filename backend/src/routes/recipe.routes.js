import express from 'express';
import Joi from 'joi';
import { asyncHandler, validate } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

// Validation schemas
const recipeDetailSchema = Joi.object({
    rawMaterialId: Joi.number().integer().required(),
    quantity: Joi.number().min(0).required(),
    unit: Joi.string().required(),
    sequence: Joi.number().integer().allow(null),
    notes: Joi.string().allow('', null)
});

/**
 * GET /api/recipes/:menuItemId/details
 * Get recipe details for a menu item
 */
router.get('/:menuItemId/details', asyncHandler(async (req, res) => {
    const menuItemId = parseInt(req.params.menuItemId);

    const details = await prisma.recipeDetail.findMany({
        where: { menuItemId },
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
    });

    res.json(details);
}));

/**
 * POST /api/recipes/:menuItemId/details
 * Add ingredient to recipe
 */
router.post('/:menuItemId/details', validate(recipeDetailSchema), asyncHandler(async (req, res) => {
    const menuItemId = parseInt(req.params.menuItemId);

    // Verify menu item exists
    const menuItem = await prisma.menuItem.findUnique({
        where: { id: menuItemId }
    });

    if (!menuItem) {
        return res.status(404).json({ error: 'Menu item not found' });
    }

    // Verify material exists
    const material = await prisma.rawMaterial.findUnique({
        where: { id: req.validatedData.rawMaterialId }
    });

    if (!material) {
        return res.status(404).json({ error: 'Material not found' });
    }

    const detail = await prisma.recipeDetail.create({
        data: {
            menuItemId,
            ...req.validatedData
        },
        include: {
            rawMaterial: true
        }
    });

    res.status(201).json(detail);
}));

/**
 * PUT /api/recipes/:menuItemId/details/:id
 * Update recipe detail
 */
router.put('/:menuItemId/details/:id', validate(recipeDetailSchema), asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const menuItemId = parseInt(req.params.menuItemId);

    const detail = await prisma.recipeDetail.update({
        where: { id, menuItemId },
        data: req.validatedData,
        include: {
            rawMaterial: true
        }
    });

    res.json(detail);
}));

/**
 * DELETE /api/recipes/:menuItemId/details/:id
 * Remove ingredient from recipe
 */
router.delete('/:menuItemId/details/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    await prisma.recipeDetail.delete({
        where: { id }
    });

    res.json({ message: 'Ingredient removed from recipe' });
}));

/**
 * POST /api/recipes/:menuItemId/duplicate
 * Duplicate a recipe to another menu item
 */
router.post('/:menuItemId/duplicate', asyncHandler(async (req, res) => {
    const sourceMenuItemId = parseInt(req.params.menuItemId);
    const { targetMenuItemId } = req.body;

    if (!targetMenuItemId) {
        return res.status(400).json({ error: 'Target menu item ID is required' });
    }

    // Get source recipe details
    const sourceDetails = await prisma.recipeDetail.findMany({
        where: { menuItemId: sourceMenuItemId }
    });

    // Create new details for target
    const newDetails = await Promise.all(
        sourceDetails.map(detail =>
            prisma.recipeDetail.create({
                data: {
                    menuItemId: targetMenuItemId,
                    rawMaterialId: detail.rawMaterialId,
                    quantity: detail.quantity,
                    unit: detail.unit,
                    sequence: detail.sequence,
                    notes: detail.notes
                }
            })
        )
    );

    res.status(201).json({
        message: 'Recipe duplicated successfully',
        count: newDetails.length
    });
}));

export default router;
