import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all user routes
router.use(authenticateToken);

// Validation middleware
const validateProfileUpdate = [
  body('username').optional().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('email').optional().isEmail().normalizeEmail()
];

const validatePasswordChange = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
];

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', validateProfileUpdate, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, email } = req.body;
    const updateData: any = {};

    // Check if username is being updated
    if (username) {
      // Check if username is already taken
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          id: { not: req.user!.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updateData.username = username;
    }

    // Check if email is being updated
    if (email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: req.user!.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already taken' });
      }
      updateData.email = email;
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', validatePasswordChange, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get user dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
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

    const [totalIncome, totalExpenses, transactionCount, categoryCount, budgetCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true }
      }),
      prisma.transaction.count({ where }),
      prisma.category.count({ where: { userId: req.user!.id } }),
      prisma.budget.count({ 
        where: { 
          userId: req.user!.id,
          isActive: true
        } 
      })
    ]);

    const income = totalIncome._sum.amount || 0;
    const expenses = totalExpenses._sum.amount || 0;
    const balance = income - expenses;

    // Get top spending categories
    const topSpendingCategories = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true },
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      },
      take: 5
    });

    const topCategories = await Promise.all(
      topSpendingCategories.map(async (item) => {
        const category = await prisma.category.findUnique({
          where: { id: item.categoryId },
          select: { name: true, color: true, icon: true }
        });

        return {
          categoryId: item.categoryId,
          categoryName: category?.name || 'Unknown',
          color: category?.color,
          icon: category?.icon,
          totalSpent: item._sum.amount || 0
        };
      })
    );

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
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
      orderBy: { date: 'desc' },
      take: 5
    });

    res.json({
      overview: {
        income,
        expenses,
        balance,
        transactionCount,
        categoryCount,
        budgetCount
      },
      topSpendingCategories: topCategories,
      recentTransactions,
      period: { startDate, endDate }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    // Delete all user data (cascade will handle related records)
    await prisma.user.delete({
      where: { id: req.user!.id }
    });

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
