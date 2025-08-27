import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, Loader2 } from 'lucide-react';
import { AICategorizationService } from '../services/aiCategorizationService';
import { AICategorizationResponse } from '../types';

interface SmartCategorySuggestionProps {
  description: string;
  type: 'income' | 'expense';
  onCategorySelect: (category: string) => void;
  currentCategory?: string;
  disabled?: boolean;
}

const SmartCategorySuggestion: React.FC<SmartCategorySuggestionProps> = ({
  description,
  type,
  onCategorySelect,
  currentCategory,
  disabled = false
}) => {
  const [suggestion, setSuggestion] = useState<AICategorizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-suggest when description changes (with debounce)
  useEffect(() => {
    if (!description.trim() || disabled) {
      setSuggestion(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (description.trim().length > 3) { // Only suggest for descriptions longer than 3 characters
        await getSuggestion();
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [description, type, disabled]);

  const getSuggestion = async () => {
    if (!description.trim() || disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await AICategorizationService.categorizeTransaction({
        description: description.trim(),
        type
      });
      setSuggestion(result);
      setShowSuggestions(true);
    } catch (err) {
      setError('Failed to get AI suggestion');
      console.error('AI categorization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      onCategorySelect(suggestion.category);
      setShowSuggestions(false);
      
      // Track the accepted suggestion for feedback collection
      (window as any).lastAISuggestion = suggestion.category;
      
      // Add positive feedback
      // Note: In a real app, you'd want to call a feedback API here
      console.log('AI suggestion accepted:', suggestion.category);
    }
  };

  const handleRejectSuggestion = () => {
    setShowSuggestions(false);
  };

  const handleAlternativeSelect = (category: string) => {
    onCategorySelect(category);
    setShowSuggestions(false);
    
    // Track the selected alternative for feedback collection
    (window as any).lastAISuggestion = category;
    
    // Add feedback that user chose alternative over primary suggestion
    if (suggestion) {
      console.log('User chose alternative category:', category, 'over primary suggestion:', suggestion.category);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.7) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  };

  if (disabled || !description.trim()) {
    return null;
  }

  return (
    <div className="relative">
      {/* AI Suggestion Button */}
      {!showSuggestions && !suggestion && (
        <button
          type="button"
          onClick={getSuggestion}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/30"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isLoading ? 'Analyzing...' : 'AI Suggest Category'}
        </button>
      )}

      {/* Suggestion Display */}
      {suggestion && showSuggestions && (
        <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  AI Suggestion
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getConfidenceColor(suggestion.confidence)} bg-white dark:bg-gray-800`}>
                  {getConfidenceLabel(suggestion.confidence)} Confidence
                </span>
              </div>
              
              <div className="mb-3">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {suggestion.category}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Based on: "{description}"
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Confidence</span>
                  <span>{Math.round(suggestion.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      suggestion.confidence >= 0.9 ? 'bg-green-500' :
                      suggestion.confidence >= 0.7 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${suggestion.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Alternative Suggestions */}
              {suggestion.alternatives && suggestion.alternatives.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alternative categories:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.alternatives.map((alt, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAlternativeSelect(alt)}
                        className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAcceptSuggestion}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <Check className="w-4 h-4" />
                  Accept Suggestion
                </button>
                <button
                  type="button"
                  onClick={handleRejectSuggestion}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
          <div className="text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCategorySuggestion;
