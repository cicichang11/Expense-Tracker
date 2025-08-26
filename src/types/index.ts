export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  createdAt: string;
}

// New: Budget interface
export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// New: Goal interface
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category?: string;
  type: 'savings' | 'debt' | 'investment';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// New: Notification interface
export interface Notification {
  id: string;
  type: 'budget_alert' | 'goal_reminder' | 'spending_insight';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface TransactionFormData {
  amount: string;
  type: 'income' | 'expense';
  description: string;
  category: string;
  date: string;
}

export interface CategoryFormData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

// New: Budget form data
export interface BudgetFormData {
  categoryId: string;
  amount: string;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
}

// New: Goal form data
export interface GoalFormData {
  name: string;
  targetAmount: string;
  targetDate: string;
  category?: string;
  type: 'savings' | 'debt' | 'investment';
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  // New: Budget tracking stats
  budgetUtilization: number;
  overspentCategories: string[];
  upcomingGoals: Goal[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// New: Budget chart data
export interface BudgetChartData {
  category: string;
  spent: number;
  budget: number;
  remaining: number;
  percentage: number;
  color: string;
}

export interface FilterOptions {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface SortOptions {
  field: 'date' | 'amount' | 'description' | 'category';
  direction: 'asc' | 'desc';
}

// New: Export options
export interface ExportOptions {
  format: 'csv' | 'pdf';
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: string[];
  includeCharts?: boolean;
}

// New: App settings
export interface AppSettings {
  theme: 'light' | 'dark';
  currency: string;
  dateFormat: string;
  notifications: {
    budgetAlerts: boolean;
    goalReminders: boolean;
    spendingInsights: boolean;
  };
}
