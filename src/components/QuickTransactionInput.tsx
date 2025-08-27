import React, { useState } from 'react';
import { Zap, ArrowRight, Loader2 } from 'lucide-react';
import { AICategorizationService } from '../services/aiCategorizationService';

interface QuickTransactionInputProps {
  onTransactionCreate: (transaction: {
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
  }) => void;
}

const QuickTransactionInput: React.FC<QuickTransactionInputProps> = ({ onTransactionCreate }) => {
  const [quickText, setQuickText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedTransaction, setParsedTransaction] = useState<{
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse quick text like "starbucks, 20 bucks" or "salary 5000"
  const parseQuickText = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setError(null);
    setParsedTransaction(null);

    try {
      // Basic parsing logic
      const lowerText = text.toLowerCase();
      
      // Determine if it's income or expense based on keywords
      const isIncome = ['salary', 'income', 'paycheck', 'payment', 'refund', 'gift', 'bonus', 'commission'].some(keyword => 
        lowerText.includes(keyword)
      );
      
      const type: 'income' | 'expense' = isIncome ? 'income' : 'expense';

      // Extract amount (look for numbers, currency symbols, etc.)
      const amountMatch = text.match(/(\d+(?:\.\d{2})?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

      if (amount === 0) {
        throw new Error('Could not detect amount. Try: "starbucks, 20" or "salary 5000"');
      }

      // Extract description (remove amount and clean up)
      let description = text
        .replace(/\d+(?:\.\d{2})?/g, '') // Remove amount
        .replace(/[,\.]/g, ' ') // Replace commas/dots with spaces
        .replace(/\b(bucks?|dollars?|usd|eur|gbp)\b/gi, '') // Remove currency words
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      if (!description) {
        description = 'Quick Transaction';
      }

      // Get AI category suggestion
      const aiResponse = await AICategorizationService.categorizeTransaction({
        description,
        type
      });

      const parsed = {
        description,
        amount,
        category: aiResponse.category,
        type
      };

      setParsedTransaction(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse transaction');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedTransaction) {
      onTransactionCreate(parsedTransaction);
      setQuickText('');
      setParsedTransaction(null);
    }
  };

  const handleQuickParse = () => {
    parseQuickText(quickText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuickParse();
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Input Section */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg dark:from-purple-900/20 dark:to-blue-900/20 dark:border-purple-700">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Quick Transaction
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Type naturally: "starbucks, 20 bucks" or "salary 5000"
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="starbucks, 20 bucks"
            className="flex-1 input"
            disabled={isProcessing}
          />
          <button
            type="button"
            onClick={handleQuickParse}
            disabled={!quickText.trim() || isProcessing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Parsed Transaction Preview */}
      {parsedTransaction && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Transaction Preview
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Description:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{parsedTransaction.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className={`font-medium ${parsedTransaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${parsedTransaction.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Category:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{parsedTransaction.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span className={`font-medium ${parsedTransaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {parsedTransaction.type.charAt(0).toUpperCase() + parsedTransaction.type.slice(1)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Add Transaction
            </button>
            <button
              type="button"
              onClick={() => {
                setParsedTransaction(null);
                setQuickText('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuickTransactionInput;
