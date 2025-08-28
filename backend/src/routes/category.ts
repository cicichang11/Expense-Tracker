import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all category routes
router.use(authenticateToken);

// Validation middleware
const validateCategory = [
  body('name').trim().isLength({ min: 1, max: 50 }),
  body('type').isIn(['INCOME', 'EXPENSE']),
  body('color').isHexColor(),
  body('icon').trim().isLength({ min: 1, max: 10 })
];

// Get all categories for the authenticated user
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user!.id },
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create new category
router.post('/', validateCategory, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, type, color, icon } = req.body;

    // Check if category name already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: req.user!.id
      }
    });

    if (existingCategory) {
      return res.status(400).json({ 
        error: 'Category with this name already exists' 
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        color,
        icon,
        userId: req.user!.id
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/:id', validateCategory, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { id } = req.params;
    const { name, type, color, icon } = req.body;

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if new name conflicts with existing category
    if (name !== existingCategory.name) {
      const nameConflict = await prisma.category.findFirst({
        where: {
          name,
          userId: req.user!.id,
          id: { not: id }
        }
      });

      if (nameConflict) {
        return res.status(400).json({ 
          error: 'Category with this name already exists' 
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        type,
        color,
        icon
      }
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has transactions
    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id }
    });

    if (transactionCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing transactions' 
      });
    }

    // Check if category has budgets
    const budgetCount = await prisma.budget.count({
      where: { categoryId: id }
    });

    if (budgetCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing budgets' 
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
