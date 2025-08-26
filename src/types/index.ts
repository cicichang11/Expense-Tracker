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

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
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
