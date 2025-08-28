import { Router } from 'express';
import { body, validationResult, query } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all transaction routes
router.use(authenticateToken);

// Validation middleware
const validateTransaction = [
  body('amount').isFloat({ min: 0.01 }),
  body('type').isIn(['INCOME', 'EXPENSE']),
  body('description').optional().trim().isLength({ max: 500 }),
  body('categoryId').isString().notEmpty(),
  body('date').isISO8601().toDate()
];

// Get all transactions for the authenticated user with filtering
router.get('/', [
  query('type').optional().isIn(['INCOME', 'EXPENSE']),
  query('categoryId').optional().isString(),
  query('startDate').optional().isISO8601().toDate(),
  query('endDate').optional().isISO8601().toDate(),
  query('search').optional().trim().isLength({ max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      type,
      categoryId,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 50
    } = req.query;

    // Build where clause
    const where: any = {
      userId: req.user!.id
    };

    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }
    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.transaction.count({ where });

    // Get transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where,
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
        { date: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    res.json({
      transactions,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: Number(limit)
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
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

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create new transaction
router.post('/', validateTransaction, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { amount, type, description, categoryId, date } = req.body;

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

    // Verify category type matches transaction type
    if (category.type !== type) {
      return res.status(400).json({ 
        error: 'Category type must match transaction type' 
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        description,
        categoryId,
        date,
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

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
router.put('/:id', validateTransaction, async (req, res) => {
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
    const { amount, type, description, categoryId, date } = req.body;

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
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

    // Verify category type matches transaction type
    if (category.type !== type) {
      return res.status(400).json({ 
        error: 'Category type must match transaction type' 
      });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        type,
        description,
        categoryId,
        date
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

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if transaction exists and belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Get transaction statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {
      userId: req.user!.id
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const [totalIncome, totalExpenses, transactionCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true }
      }),
      prisma.transaction.count({ where })
    ]);

    const income = totalIncome._sum.amount || 0;
    const expenses = totalExpenses._sum.amount || 0;
    const balance = income - expenses;

    res.json({
      income,
      expenses,
      balance,
      transactionCount,
      period: { startDate, endDate }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
