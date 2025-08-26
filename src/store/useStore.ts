import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  Transaction, 
  Category, 
  Budget, 
  Goal, 
  Notification, 
  AppSettings,
  FilterOptions, 
  SortOptions,
  BudgetChartData
} from '../types'

interface StoreState {
  // Data
  transactions: Transaction[]
  categories: Category[]
  budgets: Budget[]
  goals: Goal[]
  notifications: Notification[]
  settings: AppSettings
  
  // UI State
  isTransactionModalOpen: boolean
  isCategoryModalOpen: boolean
  isBudgetModalOpen: boolean
  isGoalModalOpen: boolean
  editingTransaction: Transaction | null
  editingCategory: Category | null
  editingBudget: Budget | null
  editingGoal: Goal | null
  
  // Filters and Sorting
  filterOptions: FilterOptions
  sortOptions: SortOptions
  
  // Actions
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addCategory: (category: Category) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // New: Budget actions
  addBudget: (budget: Budget) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  
  // New: Goal actions
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  updateGoalProgress: (id: string, amount: number) => void
  
  // New: Notification actions
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void
  
  // New: Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void
  toggleTheme: () => void
  
  // UI Actions
  openTransactionModal: (transaction?: Transaction) => void
  closeTransactionModal: () => void
  openCategoryModal: (category?: Category) => void
  closeCategoryModal: () => void
  openBudgetModal: (budget?: Budget) => void
  closeBudgetModal: () => void
  openGoalModal: (goal?: Goal) => void
  closeGoalModal: () => void
  
  // Filter and Sort Actions
  setFilterOptions: (options: Partial<FilterOptions>) => void
  setSortOptions: (options: Partial<SortOptions>) => void
  clearFilters: () => void
  
  // Computed Values
  getFilteredTransactions: () => Transaction[]
  getDashboardStats: () => {
    totalIncome: number
    totalExpenses: number
    balance: number
    monthlyIncome: number
    monthlyExpenses: number
    monthlyBalance: number
    budgetUtilization: number
    overspentCategories: string[]
    upcomingGoals: Goal[]
  }
  
  // New: Budget computed values
  getBudgetsForPeriod: (startDate: string, endDate: string) => Budget[]
  getBudgetUtilization: (categoryId: string, startDate: string, endDate: string) => {
    spent: number
    budget: number
    remaining: number
    percentage: number
  }
  getBudgetChartData: () => BudgetChartData[]
  
  // New: Goal computed values
  getActiveGoals: () => Goal[]
  getGoalProgress: (goalId: string) => number
  
  // New: Notification computed values
  getUnreadNotifications: () => Notification[]
  getNotificationsByType: (type: string) => Notification[]
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#10b981', icon: '💼', createdAt: new Date().toISOString() },
  { id: '2', name: 'Freelance', type: 'income', color: '#3b82f6', icon: '💻', createdAt: new Date().toISOString() },
  { id: '3', name: 'Investment', type: 'income', color: '#8b5cf6', icon: '📈', createdAt: new Date().toISOString() },
  { id: '4', name: 'Food & Dining', type: 'expense', color: '#f59e0b', icon: '🍽️', createdAt: new Date().toISOString() },
  { id: '5', name: 'Transportation', type: 'expense', color: '#ef4444', icon: '🚗', createdAt: new Date().toISOString() },
  { id: '6', name: 'Shopping', type: 'expense', color: '#ec4899', icon: '🛍️', createdAt: new Date().toISOString() },
  { id: '7', name: 'Bills & Utilities', type: 'expense', color: '#6b7280', icon: '📱', createdAt: new Date().toISOString() },
  { id: '8', name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: '🎬', createdAt: new Date().toISOString() },
]

const defaultSettings: AppSettings = {
  theme: 'light',
  currency: 'USD',
  dateFormat: 'MMM dd, yyyy',
  notifications: {
    budgetAlerts: true,
    goalReminders: true,
    spendingInsights: true,
  },
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      transactions: [],
      categories: defaultCategories,
      budgets: [],
      goals: [],
      notifications: [],
      settings: defaultSettings,
      isTransactionModalOpen: false,
      isCategoryModalOpen: false,
      isBudgetModalOpen: false,
      isGoalModalOpen: false,
      editingTransaction: null,
      editingCategory: null,
      editingBudget: null,
      editingGoal: null,
      filterOptions: { type: 'all' },
      sortOptions: { field: 'date', direction: 'desc' },

      // Actions
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          transactions: state.transactions.filter((t) => t.category !== id),
        })),

      // New: Budget actions
      addBudget: (budget) =>
        set((state) => ({
          budgets: [...state.budgets, budget],
        })),

      updateBudget: (id, updates) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
          ),
        })),

      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      // New: Goal actions
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      updateGoalProgress: (id, amount) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, currentAmount: g.currentAmount + amount, updatedAt: new Date().toISOString() } : g
          ),
        })),

      // New: Notification actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      clearAllNotifications: () =>
        set({ notifications: [] }),

      // New: Settings actions
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      toggleTheme: () =>
        set((state) => ({
          settings: { 
            ...state.settings, 
            theme: state.settings.theme === 'light' ? 'dark' : 'light' 
          },
        })),

      // UI Actions
      openTransactionModal: (transaction?: Transaction) =>
        set({
          isTransactionModalOpen: true,
          editingTransaction: transaction || null,
        }),

      closeTransactionModal: () =>
        set({
          isTransactionModalOpen: false,
          editingTransaction: null,
        }),

      openCategoryModal: (category?: Category) =>
        set({
          isCategoryModalOpen: true,
          editingCategory: category || null,
        }),

      closeCategoryModal: () =>
        set({
          isCategoryModalOpen: false,
          editingCategory: null,
        }),

      openBudgetModal: (budget?: Budget) =>
        set({
          isBudgetModalOpen: true,
          editingBudget: budget || null,
        }),

      closeBudgetModal: () =>
        set({
          isBudgetModalOpen: false,
          editingBudget: null,
        }),

      openGoalModal: (goal?: Goal) =>
        set({
          isGoalModalOpen: true,
          editingGoal: goal || null,
        }),

      closeGoalModal: () =>
        set({
          isGoalModalOpen: false,
          editingGoal: null,
        }),

      // Filter and Sort Actions
      setFilterOptions: (options) =>
        set((state) => ({
          filterOptions: { ...state.filterOptions, ...options },
        })),

      setSortOptions: (options) =>
        set((state) => ({
          sortOptions: { ...state.sortOptions, ...options },
        })),

      clearFilters: () =>
        set({
          filterOptions: { type: 'all' },
        }),

      // Computed Values
      getFilteredTransactions: () => {
        const { transactions, filterOptions, sortOptions } = get()
        let filtered = [...transactions]

        // Apply filters
        if (filterOptions.type && filterOptions.type !== 'all') {
          filtered = filtered.filter((t) => t.type === filterOptions.type)
        }

        if (filterOptions.category) {
          filtered = filtered.filter((t) => t.category === filterOptions.category)
        }

        if (filterOptions.dateRange) {
          filtered = filtered.filter((t) => {
            const date = new Date(t.date)
            const start = new Date(filterOptions.dateRange!.start)
            const end = new Date(filterOptions.dateRange!.end)
            return date >= start && date <= end
          })
        }

        if (filterOptions.search) {
          const search = filterOptions.search.toLowerCase()
          filtered = filtered.filter(
            (t) =>
              t.description?.toLowerCase().includes(search) ||
              t.amount.toString().includes(search) ||
              t.category.toLowerCase().includes(search)
          )
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let aValue: any = a[sortOptions.field]
          let bValue: any = b[sortOptions.field]

          if (sortOptions.field === 'date') {
            aValue = new Date(aValue).getTime()
            bValue = new Date(bValue).getTime()
          }

          if (sortOptions.direction === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })

        return filtered
      },

      getDashboardStats: () => {
        const { transactions, budgets, goals, categories } = get()
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        const totalIncome = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)

        const totalExpenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)

        const monthlyIncome = transactions
          .filter((t) => {
            const date = new Date(t.date)
            return t.type === 'income' && date.getMonth() === currentMonth && date.getFullYear() === currentYear
          })
          .reduce((sum, t) => sum + t.amount, 0)

        const monthlyExpenses = transactions
          .filter((t) => {
            const date = new Date(t.date)
            return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear
          })
          .reduce((sum, t) => sum + t.amount, 0)

        // New: Budget utilization calculation
        const activeBudgets = budgets.filter(b => b.isActive)
        const totalBudget = activeBudgets.reduce((sum, b) => sum + b.amount, 0)
        const budgetUtilization = totalBudget > 0 ? (monthlyExpenses / totalBudget) * 100 : 0

        // New: Overspent categories
        const overspentCategories = activeBudgets
          .filter(budget => {
            const category = categories.find(c => c.id === budget.categoryId)
            if (!category) return false
            
            const spent = transactions
              .filter(t => t.type === 'expense' && t.category === category.name)
              .reduce((sum, t) => sum + t.amount, 0)
            return spent > budget.amount
          })
          .map(b => b.categoryId)

        // New: Upcoming goals
        const upcomingGoals = goals
          .filter(g => g.isActive && new Date(g.targetDate) > now)
          .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
          .slice(0, 3)

        return {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          monthlyIncome,
          monthlyExpenses,
          monthlyBalance: monthlyIncome - monthlyExpenses,
          budgetUtilization,
          overspentCategories,
          upcomingGoals,
        }
      },

      // New: Budget computed values
      getBudgetsForPeriod: (startDate, endDate) => {
        const { budgets } = get()
        return budgets.filter(b => 
          b.isActive && 
          new Date(b.startDate) <= new Date(endDate) && 
          (!b.endDate || new Date(b.endDate) >= new Date(startDate))
        )
      },

      getBudgetUtilization: (categoryId, startDate, endDate) => {
        const { transactions, budgets, categories } = get()
        const budget = budgets.find(b => b.categoryId === categoryId && b.isActive)
        const category = categories.find(c => c.id === categoryId)
        
        if (!budget || !category) {
          return { spent: 0, budget: 0, remaining: 0, percentage: 0 }
        }

        const spent = transactions
          .filter(t => 
            t.type === 'expense' && 
            t.category === category.name &&
            new Date(t.date) >= new Date(startDate) &&
            new Date(t.date) <= new Date(endDate)
          )
          .reduce((sum, t) => sum + t.amount, 0)

        const budgetAmount = budget.amount
        const remaining = budgetAmount - spent
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0

        return { spent, budget: budgetAmount, remaining, percentage }
      },

      getBudgetChartData: () => {
        const { budgets, categories } = get()
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        return budgets
          .filter(b => b.isActive)
          .map(budget => {
            const category = categories.find(c => c.id === budget.categoryId)
            const { spent, budget: budgetAmount, remaining, percentage } = get().getBudgetUtilization(
              budget.categoryId,
              startOfMonth.toISOString(),
              endOfMonth.toISOString()
            )

            return {
              category: category?.name || 'Unknown',
              spent,
              budget: budgetAmount,
              remaining,
              percentage,
              color: category?.color || '#6b7280'
            }
          })
          .filter(data => data.budget > 0)
          .sort((a, b) => b.percentage - a.percentage)
      },

      // New: Goal computed values
      getActiveGoals: () => {
        const { goals } = get()
        return goals.filter(g => g.isActive)
      },

      getGoalProgress: (goalId) => {
        const { goals } = get()
        const goal = goals.find(g => g.id === goalId)
        if (!goal) return 0
        return (goal.currentAmount / goal.targetAmount) * 100
      },

      // New: Notification computed values
      getUnreadNotifications: () => {
        const { notifications } = get()
        return notifications.filter(n => !n.isRead)
      },

      getNotificationsByType: (type) => {
        const { notifications } = get()
        return notifications.filter(n => n.type === type)
      },
    }),
    {
      name: 'expense-tracker-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
        budgets: state.budgets,
        goals: state.goals,
        notifications: state.notifications,
        settings: state.settings,
      }),
    }
  )
)
