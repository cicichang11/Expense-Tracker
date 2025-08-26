import { Transaction, Category, Budget } from '../types'
import { format } from 'date-fns'

// CSV Export Functions
export const exportTransactionsToCSV = (
  transactions: Transaction[]
): string => {
  // CSV Headers
  const headers = [
    'Date',
    'Type',
    'Category',
    'Description',
    'Amount',
    'Created At'
  ]

  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => [
    format(new Date(transaction.date), 'MMM dd, yyyy'),
    transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    transaction.category,
    transaction.description || '',
    transaction.amount.toFixed(2),
    format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}

export const exportBudgetReportToCSV = (
  budgets: Budget[],
  categories: Category[],
  transactions: Transaction[],
  startDate: string,
  endDate: string
): string => {
  // CSV Headers
  const headers = [
    'Category',
    'Budget Amount',
    'Period',
    'Spent',
    'Remaining',
    'Utilization %',
    'Status'
  ]

  // Calculate budget utilization for each budget
  const rows = budgets
    .filter(budget => budget.isActive)
    .map(budget => {
      const category = categories.find(c => c.id === budget.categoryId)
      const spent = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === category?.name &&
          new Date(t.date) >= new Date(startDate) &&
          new Date(t.date) <= new Date(endDate)
        )
        .reduce((sum, t) => sum + t.amount, 0)

      const remaining = budget.amount - spent
      const utilization = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
      const status = remaining >= 0 ? 'Under Budget' : 'Over Budget'

      return [
        category?.name || 'Unknown',
        budget.amount.toFixed(2),
        budget.period,
        spent.toFixed(2),
        remaining.toFixed(2),
        utilization.toFixed(1) + '%',
        status
      ]
    })

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}

export const exportCategorySummaryToCSV = (
  categories: Category[],
  transactions: Transaction[],
  startDate: string,
  endDate: string
): string => {
  // CSV Headers
  const headers = [
    'Category',
    'Type',
    'Total Amount',
    'Transaction Count',
    'Average Amount',
    'Min Amount',
    'Max Amount'
  ]

  // Calculate summary for each category
  const rows = categories.map(category => {
    const categoryTransactions = transactions.filter(t => 
      t.category === category.name &&
      new Date(t.date) >= new Date(startDate) &&
      new Date(t.date) <= new Date(endDate)
    )

    if (categoryTransactions.length === 0) {
      return [
        category.name,
        category.type,
        '0.00',
        '0',
        '0.00',
        '0.00',
        '0.00'
      ]
    }

    const amounts = categoryTransactions.map(t => t.amount)
    const total = amounts.reduce((sum, amount) => sum + amount, 0)
    const average = total / amounts.length
    const min = Math.min(...amounts)
    const max = Math.max(...amounts)

    return [
      category.name,
      category.type,
      total.toFixed(2),
      categoryTransactions.length.toString(),
      average.toFixed(2),
      min.toFixed(2),
      max.toFixed(2)
    ]
  })

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}

// Download Helper Functions
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const generateFilename = (type: string, dateRange?: { start: string; end: string }): string => {
  const now = new Date()
  const timestamp = format(now, 'yyyy-MM-dd_HH-mm')
  
  if (dateRange) {
    const start = format(new Date(dateRange.start), 'yyyy-MM-dd')
    const end = format(new Date(dateRange.end), 'yyyy-MM-dd')
    return `expense-tracker_${type}_${start}_to_${end}_${timestamp}.csv`
  }
  
  return `expense-tracker_${type}_${timestamp}.csv`
}

// PDF Export Functions (Placeholder for future implementation)
export const exportToPDF = async (
  type: 'transactions' | 'budget' | 'summary'
): Promise<void> => {
  // This will be implemented in the next phase
  console.log(`PDF export for ${type} not yet implemented`)
  throw new Error('PDF export coming soon!')
}
