import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all AI routes
router.use(authenticateToken);

// Validation middleware
const validateCategorizationRequest = [
  body('description').trim().isLength({ min: 1, max: 500 }),
  body('type').isIn(['INCOME', 'EXPENSE'])
];

const validateFeedback = [
  body('originalDescription').trim().isLength({ min: 1, max: 500 }),
  body('suggestedCategory').trim().isLength({ min: 1, max: 100 }),
  body('userSelectedCategory').trim().isLength({ min: 1, max: 100 }),
  body('isCorrect').isBoolean()
];

// AI-powered transaction categorization
router.post('/categorize', validateCategorizationRequest, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { description, type } = req.body;

    // Get user's categories for the specified type
    const userCategories = await prisma.category.findMany({
      where: {
        userId: req.user!.id,
        type
      },
      select: {
        id: true,
        name: true
      }
    });

    if (userCategories.length === 0) {
      return res.status(400).json({ 
        error: 'No categories found for this transaction type' 
      });
    }

    // TODO: Replace with actual OpenAI API call
    // For now, use a simple keyword-based approach
    const suggestion = await categorizeByKeywords(description, type, userCategories);

    res.json({
      category: suggestion.category,
      confidence: suggestion.confidence,
      alternatives: suggestion.alternatives,
      description,
      type
    });

  } catch (error) {
    console.error('AI categorization error:', error);
    res.status(500).json({ error: 'Failed to categorize transaction' });
  }
});

// Submit feedback for AI categorization
router.post('/feedback', validateFeedback, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { originalDescription, suggestedCategory, userSelectedCategory, isCorrect } = req.body;

    // Save feedback to database
    const feedback = await prisma.aICategorizationFeedback.create({
      data: {
        originalDescription,
        suggestedCategory,
        userSelectedCategory,
        isCorrect,
        userId: req.user!.id
      }
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get AI categorization feedback statistics
router.get('/feedback/stats', async (req, res) => {
  try {
    const [totalFeedback, correctPredictions, incorrectPredictions] = await Promise.all([
      prisma.aICategorizationFeedback.count({
        where: { userId: req.user!.id }
      }),
      prisma.aICategorizationFeedback.count({
        where: { 
          userId: req.user!.id,
          isCorrect: true
        }
      }),
      prisma.aICategorizationFeedback.count({
        where: { 
          userId: req.user!.id,
          isCorrect: false
        }
      })
    ]);

    const accuracy = totalFeedback > 0 ? (correctPredictions / totalFeedback) * 100 : 0;

    // Get most common incorrect suggestions
    const incorrectSuggestions = await prisma.aICategorizationFeedback.groupBy({
      by: ['suggestedCategory'],
      where: {
        userId: req.user!.id,
        isCorrect: false
      },
      _count: {
        suggestedCategory: true
      },
      orderBy: {
        _count: {
          suggestedCategory: 'desc'
        }
      },
      take: 5
    });

    res.json({
      totalFeedback,
      correctPredictions,
      incorrectPredictions,
      accuracy: Math.round(accuracy * 100) / 100,
      topIncorrectSuggestions: incorrectSuggestions.map(item => ({
        category: item.suggestedCategory,
        count: item._count.suggestedCategory
      }))
    });

  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback statistics' });
  }
});

// Get recent AI categorization feedback
router.get('/feedback/recent', async (req, res) => {
  try {
    const feedback = await prisma.aICategorizationFeedback.findMany({
      where: { userId: req.user!.id },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    res.json(feedback);

  } catch (error) {
    console.error('Get recent feedback error:', error);
    res.status(500).json({ error: 'Failed to fetch recent feedback' });
  }
});

// Simple keyword-based categorization (temporary until OpenAI integration)
async function categorizeByKeywords(
  description: string, 
  type: string, 
  userCategories: { id: string; name: string }[]
): Promise<{ category: string; confidence: number; alternatives?: string[] }> {
  
  const lowerDesc = description.toLowerCase();
  
  // Define keyword mappings for common categories
  const keywordMappings: { [key: string]: string[] } = {
    'Food & Dining': [
      'food', 'lunch', 'dinner', 'breakfast', 'coffee', 'restaurant', 'cafe', 
      'pizza', 'burger', 'meal', 'snack', 'drink', 'beverage', 'starbucks', 
      'mcdonalds', 'kfc', 'subway', 'dominos', 'chipotle', 'taco', 'sushi'
    ],
    'Transportation': [
      'uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'toll', 'bus', 
      'train', 'subway', 'metro', 'car', 'vehicle', 'maintenance', 'repair'
    ],
    'Shopping': [
      'amazon', 'walmart', 'target', 'mall', 'store', 'clothes', 'shoes', 
      'electronics', 'books', 'gifts', 'purchase', 'buy'
    ],
    'Bills': [
      'electricity', 'water', 'gas', 'internet', 'phone', 'cable', 'rent', 
      'mortgage', 'insurance', 'utility', 'bill', 'payment'
    ],
    'Entertainment': [
      'movie', 'theater', 'concert', 'show', 'game', 'netflix', 'spotify', 
      'hulu', 'disney', 'amazon prime', 'subscription'
    ],
    'Healthcare': [
      'doctor', 'hospital', 'pharmacy', 'medicine', 'dental', 'vision', 
      'medical', 'health', 'clinic', 'appointment'
    ]
  };

  // Find the best matching category
  let bestMatch = { category: 'Other', confidence: 0.3 };
  const matches: { category: string; score: number }[] = [];

  for (const [categoryName, keywords] of Object.entries(keywordMappings)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        score += 1;
      }
    }
    
    if (score > 0) {
      const confidence = Math.min(0.3 + (score * 0.15), 0.95);
      matches.push({ category: categoryName, score: confidence });
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { category: categoryName, confidence };
      }
    }
  }

  // Check if the best match exists in user's categories
  const userCategoryNames = userCategories.map(cat => cat.name);
  if (!userCategoryNames.includes(bestMatch.category)) {
    // Find the best matching user category
    const userMatch = matches.find(match => userCategoryNames.includes(match.category));
    if (userMatch) {
      bestMatch = { category: userMatch.category, confidence: userMatch.score };
    } else {
      bestMatch = { category: userCategories[0]?.name || 'Other', confidence: 0.3 };
    }
  }

  // Generate alternatives (top 3 user categories that aren't the best match)
  const alternatives = userCategories
    .filter(cat => cat.name !== bestMatch.category)
    .slice(0, 3)
    .map(cat => cat.name);

  return {
    category: bestMatch.category,
    confidence: bestMatch.confidence,
    alternatives
  };
}

export default router;
