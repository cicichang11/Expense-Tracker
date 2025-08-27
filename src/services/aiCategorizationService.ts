import { AICategorizationRequest, AICategorizationResponse } from '../types';

// Mock AI categorization service
// In production, this would call OpenAI GPT, Google Gemini, or a custom ML model
export class AICategorizationService {
  private static readonly EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Healthcare',
    'Travel',
    'Education',
    'Home & Garden',
    'Personal Care',
    'Other'
  ];

  private static readonly INCOME_CATEGORIES = [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Gift',
    'Refund',
    'Other'
  ];

  // Mock categorization logic based on keywords
  private static categorizeByKeywords(description: string, type: 'income' | 'expense'): AICategorizationResponse {
    const lowerDesc = description.toLowerCase();
    const categories = type === 'expense' ? this.EXPENSE_CATEGORIES : this.INCOME_CATEGORIES;

    // Food & Dining keywords
    const foodKeywords = ['food', 'lunch', 'dinner', 'breakfast', 'coffee', 'restaurant', 'cafe', 'pizza', 'burger', 'meal', 'snack', 'drink', 'beverage', 'starbucks', 'mcdonalds', 'kfc', 'subway', 'dominos', 'chipotle', 'taco', 'sushi', 'chinese', 'italian', 'mexican', 'indian', 'thai', 'japanese', 'greek', 'mediterranean', 'bakery', 'deli', 'sandwich', 'salad', 'soup', 'noodles', 'rice', 'pasta', 'steak', 'chicken', 'fish', 'seafood', 'dessert', 'ice cream', 'cake', 'cookie', 'bread', 'milk', 'juice', 'soda', 'beer', 'wine', 'cocktail', 'bar', 'pub', 'tavern', 'grill', 'bbq', 'buffet', 'takeout', 'delivery', 'dine in', 'fast food', 'fine dining', 'casual dining', 'latte', 'cappuccino', 'espresso', 'americano', 'mocha', 'frappuccino', 'hot chocolate', 'tea', 'boba', 'bubble tea', 'smoothie', 'shake', 'milkshake', 'fries', 'chips', 'nuggets', 'wings', 'hot dog', 'hotdog', 'burrito', 'quesadilla', 'enchilada', 'curry', 'noodle', 'ramen', 'pho', 'pad thai', 'spring roll', 'dumpling', 'gyro', 'kebab', 'falafel', 'hummus', 'pita', 'bagel', 'croissant', 'muffin', 'donut', 'doughnut', 'cupcake', 'brownie', 'pie', 'cheesecake', 'tiramisu', 'gelato', 'sorbet', 'yogurt', 'parfait', 'granola', 'oatmeal', 'cereal', 'toast', 'eggs', 'bacon', 'sausage', 'hash browns', 'pancakes', 'waffles', 'french toast', 'omelette', 'omelet', 'quiche', 'frittata'];
    
    if (foodKeywords.some(keyword => lowerDesc.includes(keyword))) {
      // Higher confidence for specific brand names and clear food terms
      const specificBrands = ['starbucks', 'mcdonalds', 'kfc', 'subway', 'dominos', 'chipotle'];
      const specificFoods = ['pizza', 'burger', 'sushi', 'taco', 'coffee', 'latte', 'cappuccino'];
      
      if (specificBrands.some(brand => lowerDesc.includes(brand))) {
        return { category: 'Food & Dining', confidence: 0.98 };
      } else if (specificFoods.some(food => lowerDesc.includes(food))) {
        return { category: 'Food & Dining', confidence: 0.96 };
      } else {
        return { category: 'Food & Dining', confidence: 0.94 };
      }
    }

    // Transportation keywords
    if (['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus', 'train', 'subway', 'car', 'transport'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Transportation', confidence: 0.92 };
    }

    // Shopping keywords
    if (['amazon', 'walmart', 'target', 'mall', 'store', 'shop', 'buy', 'purchase', 'clothing', 'shoes', 'electronics'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Shopping', confidence: 0.88 };
    }

    // Bills & Utilities keywords
    if (['bill', 'electric', 'water', 'gas', 'internet', 'phone', 'cable', 'rent', 'mortgage', 'insurance', 'utility'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Bills & Utilities', confidence: 0.94 };
    }

    // Entertainment keywords
    if (['movie', 'theater', 'concert', 'show', 'game', 'netflix', 'spotify', 'hulu', 'entertainment', 'fun'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Entertainment', confidence: 0.87 };
    }

    // Healthcare keywords
    if (['doctor', 'hospital', 'medical', 'pharmacy', 'medicine', 'dental', 'health', 'clinic', 'therapy'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Healthcare', confidence: 0.93 };
    }

    // Travel keywords
    if (['hotel', 'flight', 'airline', 'vacation', 'trip', 'travel', 'booking', 'resort', 'airbnb'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Travel', confidence: 0.91 };
    }

    // Education keywords
    if (['school', 'university', 'college', 'course', 'book', 'textbook', 'tuition', 'education', 'learning'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Education', confidence: 0.89 };
    }

    // Home & Garden keywords
    if (['home', 'garden', 'furniture', 'decor', 'repair', 'maintenance', 'tools', 'hardware'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Home & Garden', confidence: 0.86 };
    }

    // Personal Care keywords
    if (['haircut', 'salon', 'spa', 'beauty', 'cosmetic', 'gym', 'fitness', 'wellness'].some(keyword => lowerDesc.includes(keyword))) {
      return { category: 'Personal Care', confidence: 0.85 };
    }

    // Income categories
    if (type === 'income') {
      if (['salary', 'paycheck', 'wage', 'job', 'work'].some(keyword => lowerDesc.includes(keyword))) {
        return { category: 'Salary', confidence: 0.96 };
      }
      if (['freelance', 'contract', 'project', 'consulting'].some(keyword => lowerDesc.includes(keyword))) {
        return { category: 'Freelance', confidence: 0.90 };
      }
      if (['investment', 'dividend', 'stock', 'bond', 'interest'].some(keyword => lowerDesc.includes(keyword))) {
        return { category: 'Investment', confidence: 0.88 };
      }
      if (['business', 'company', 'startup', 'entrepreneur'].some(keyword => lowerDesc.includes(keyword))) {
        return { category: 'Business', confidence: 0.87 };
      }
      if (['gift', 'present', 'donation', 'charity'].some(keyword => lowerDesc.includes(keyword))) {
        return { category: 'Gift', confidence: 0.82 };
      }
      if (['refund', 'return', 'cashback', 'rebate'].some(keyword => lowerDesc.includes(keyword))) {
        return { category: 'Refund', confidence: 0.89 };
      }
    }

    // Default fallback with low confidence
    return { 
      category: categories[categories.length - 1], // "Other"
      confidence: 0.3,
      alternatives: categories.slice(0, 3) // Suggest top 3 alternatives
    };
  }

  // Main categorization method
  static async categorizeTransaction(request: AICategorizationRequest): Promise<AICategorizationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // In production, this would make an HTTP request to your AI service
    // const response = await fetch('/api/categorize-transaction', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request)
    // });
    // return await response.json();

    // For now, use our mock service
    return this.categorizeByKeywords(request.description, request.type);
  }

  // Method to get available categories for a transaction type
  static getAvailableCategories(type: 'income' | 'expense'): string[] {
    return type === 'expense' ? this.EXPENSE_CATEGORIES : this.INCOME_CATEGORIES;
  }
}
