import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { generateToken } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('password').isLength({ min: 6 })
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Create default categories for the user
    const defaultCategories = [
      { name: 'Food & Dining', type: 'EXPENSE', color: '#3B82F6', icon: '🍽️' },
      { name: 'Transportation', type: 'EXPENSE', color: '#10B981', icon: '🚗' },
      { name: 'Shopping', type: 'EXPENSE', color: '#F59E0B', icon: '🛍️' },
      { name: 'Bills', type: 'EXPENSE', color: '#EF4444', icon: '📄' },
      { name: 'Entertainment', type: 'EXPENSE', color: '#8B5CF6', icon: '🎬' },
      { name: 'Healthcare', type: 'EXPENSE', color: '#EC4899', icon: '🏥' },
      { name: 'Salary', type: 'INCOME', color: '#10B981', icon: '💰' },
      { name: 'Freelance', type: 'INCOME', color: '#3B82F6', icon: '💼' },
      { name: 'Investment', type: 'INCOME', color: '#F59E0B', icon: '📈' }
    ];

    await prisma.category.createMany({
      data: defaultCategories.map(category => ({
        ...category,
        userId: user.id
      }))
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
      defaultCategoriesCreated: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // This route will be protected by auth middleware
    // User info will be available in req.user
    res.json({ user: req.user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

export default router;
