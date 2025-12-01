import express from 'express';
import Joi from 'joi';
import { asyncHandler, validate, validateQuery } from '../middleware/validate.js';
import prisma from '../config/database.js';

const router = express.Router();

// Validation schemas
const supplierSchema = Joi.object({
    name: Joi.string().required(),
    contactPerson: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    address: Joi.string().allow('', null),
    paymentTerms: Joi.string().allow('', null),
    isActive: Joi.boolean()
});

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().allow(''),
    isActive: Joi.boolean()
});

/**
 * GET /api/suppliers
 * List all suppliers with pagination and search
 */
router.get('/', validateQuery(querySchema), asyncHandler(async (req, res) => {
    const { page, limit, search, isActive } = req.validatedQuery;
    const skip = (page - 1) * limit;

    const where = {
        ...(search && {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { contactPerson: { contains: search, mode: 'insensitive' } }
            ]
        }),
        ...(isActive !== undefined && { isActive })
    };

    const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { rawMaterials: true }
                }
            }
        }),
        prisma.supplier.count({ where })
    ]);

    res.json({
        data: suppliers,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
}));

/**
 * GET /api/suppliers/:id
 * Get single supplier
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
            rawMaterials: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                    currentPrice: true,
                    isActive: true
                }
            }
        }
    });

    if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(supplier);
}));

/**
 * POST /api/suppliers
 * Create new supplier
 */
router.post('/', validate(supplierSchema), asyncHandler(async (req, res) => {
    const supplier = await prisma.supplier.create({
        data: req.validatedData
    });

    res.status(201).json(supplier);
}));

/**
 * PUT /api/suppliers/:id
 * Update supplier
 */
router.put('/:id', validate(supplierSchema), asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const supplier = await prisma.supplier.update({
        where: { id },
        data: req.validatedData
    });

    res.json(supplier);
}));

/**
 * DELETE /api/suppliers/:id
 * Delete supplier (soft delete by setting isActive to false)
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    // Check if supplier has materials
    const materialsCount = await prisma.rawMaterial.count({
        where: { supplierId: id }
    });

    if (materialsCount > 0) {
        // Soft delete
        await prisma.supplier.update({
            where: { id },
            data: { isActive: false }
        });
    } else {
        // Hard delete
        await prisma.supplier.delete({
            where: { id }
        });
    }

    res.json({ message: 'Supplier deleted successfully' });
}));

export default router;
