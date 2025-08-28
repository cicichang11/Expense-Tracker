import { Router } from 'express';
import { body, validationResult, query } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all budget routes
router.use(authenticateToken);

// Validation middleware
const validateBudget = [
  body('amount').isFloat({ min: 0.01 }),
  body('period').isIn(['MONTHLY', 'YEARLY']),
  body('startDate').isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate(),
  body('categoryId').isString().notEmpty()
];

// Get all budgets for the authenticated user
router.get('/', async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user!.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
          }
        }
      },
      orderBy: [
        { startDate: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Get budget by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: req.user!.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
          }
        }
      }
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// Create new budget
router.post('/', validateBudget, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { amount, period, startDate, endDate, categoryId } = req.body;

    // Verify category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: req.user!.id
      }
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Check for overlapping budgets for the same category and period
    const overlappingBudget = await prisma.budget.findFirst({
      where: {
        categoryId,
        userId: req.user!.id,
        isActive: true,
        OR: [
          {
            startDate: { lte: startDate },
            endDate: { gte: startDate }
          },
          {
            startDate: { lte: endDate || startDate },
            endDate: { gte: endDate || startDate }
          },
          {
            startDate: { gte: startDate },
            endDate: { lte: endDate || startDate }
          }
        ]
      }
    });

    if (overlappingBudget) {
      return res.status(400).json({ 
        error: 'Budget already exists for this category and period' 
      });
    }

    const budget = await prisma.budget.create({
      data: {
        amount,
        period,
        startDate,
        endDate,
        categoryId,
        userId: req.user!.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
          }
        }
      }
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Update budget
router.put('/:id', validateBudget, async (req, res) => {
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
    const { amount, period, startDate, endDate, categoryId } = req.body;

    // Check if budget exists and belongs to user
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!existingBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Verify category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: req.user!.id
      }
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Check for overlapping budgets (excluding current budget)
    const overlappingBudget = await prisma.budget.findFirst({
      where: {
        categoryId,
        userId: req.user!.id,
        isActive: true,
        id: { not: id },
        OR: [
          {
            startDate: { lte: startDate },
            endDate: { gte: startDate }
          },
          {
            startDate: { lte: endDate || startDate },
            endDate: { gte: endDate || startDate }
          },
          {
            startDate: { gte: startDate },
            endDate: { lte: endDate || startDate }
          }
        ]
      }
    });

    if (overlappingBudget) {
      return res.status(400).json({ 
        error: 'Budget already exists for this category and period' 
      });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        amount,
        period,
        startDate,
        endDate,
        categoryId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
          }
        }
      }
    });

    res.json(updatedBudget);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if budget exists and belongs to user
    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await prisma.budget.delete({
      where: { id }
    });

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// Get budget utilization
router.get('/:id/utilization', async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Check if budget exists and belongs to user
    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Calculate date range for utilization
    const periodStart = startDate ? new Date(startDate as string) : budget.startDate;
    const periodEnd = endDate ? new Date(endDate as string) : (budget.endDate || new Date());

    // Get total spending for the period
    const totalSpending = await prisma.transaction.aggregate({
      where: {
        categoryId: budget.categoryId,
        userId: req.user!.id,
        type: 'EXPENSE',
        date: {
          gte: periodStart,
          lte: periodEnd
        }
      },
      _sum: { amount: true }
    });

    const spent = totalSpending._sum.amount || 0;
    const remaining = budget.amount - spent;
    const utilizationPercentage = (spent / budget.amount) * 100;

    res.json({
      budget,
      utilization: {
        spent,
        remaining,
        utilizationPercentage,
        period: {
          start: periodStart,
          end: periodEnd
        }
      }
    });

  } catch (error) {
    console.error('Get budget utilization error:', error);
    res.status(500).json({ error: 'Failed to fetch budget utilization' });
  }
});

// Get all budgets with utilization
router.get('/overview/utilization', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user!.id,
        isActive: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
          }
        }
      }
    });

    const budgetsWithUtilization = await Promise.all(
      budgets.map(async (budget) => {
        // Calculate date range for utilization
        const periodStart = startDate ? new Date(startDate as string) : budget.startDate;
        const periodEnd = endDate ? new Date(endDate as string) : (budget.endDate || new Date());

        // Get total spending for the period
        const totalSpending = await prisma.transaction.aggregate({
          where: {
            categoryId: budget.categoryId,
            userId: req.user!.id,
            type: 'EXPENSE',
            date: {
              gte: periodStart,
              lte: periodEnd
            }
          },
          _sum: { amount: true }
        });

        const spent = totalSpending._sum.amount || 0;
        const remaining = budget.amount - spent;
        const utilizationPercentage = (spent / budget.amount) * 100;

        return {
          ...budget,
          utilization: {
            spent,
            remaining,
            utilizationPercentage,
            period: {
              start: periodStart,
              end: periodEnd
            }
          }
        };
      })
    );

    res.json(budgetsWithUtilization);

  } catch (error) {
    console.error('Get budgets overview error:', error);
    res.status(500).json({ error: 'Failed to fetch budgets overview' });
  }
});

export default router;
