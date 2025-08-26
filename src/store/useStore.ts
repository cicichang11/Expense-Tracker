import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, Category, TransactionFormData, CategoryFormData, FilterOptions, SortOptions } from '../types'

interface StoreState {
  // Data
  transactions: Transaction[]
  categories: Category[]
  
  // UI State
  isTransactionModalOpen: boolean
  isCategoryModalOpen: boolean
  editingTransaction: Transaction | null
  editingCategory: Category | null
  
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
  
  // UI Actions
  openTransactionModal: (transaction?: Transaction) => void
  closeTransactionModal: () => void
  openCategoryModal: (category?: Category) => void
  closeCategoryModal: () => void
  
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
  }
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

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      transactions: [],
      categories: defaultCategories,
      isTransactionModalOpen: false,
      isCategoryModalOpen: false,
      editingTransaction: null,
      editingCategory: null,
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

      // UI Actions
      openTransactionModal: (transaction = null) =>
        set({
          isTransactionModalOpen: true,
          editingTransaction: transaction,
        }),

      closeTransactionModal: () =>
        set({
          isTransactionModalOpen: false,
          editingTransaction: null,
        }),

      openCategoryModal: (category = null) =>
        set({
          isCategoryModalOpen: true,
          editingCategory: category,
        }),

      closeCategoryModal: () =>
        set({
          isCategoryModalOpen: false,
          editingCategory: null,
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
        const { transactions } = get()
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

        return {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          monthlyIncome,
          monthlyExpenses,
          monthlyBalance: monthlyIncome - monthlyExpenses,
        }
      },
    }),
    {
      name: 'expense-tracker-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
      }),
    }
  )
)
