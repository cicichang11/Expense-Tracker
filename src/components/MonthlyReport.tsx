import { Transaction } from '../types'
import { format } from 'date-fns'
import { useStore } from '../store/useStore'

interface MonthlyReportProps {
  month: Date
  transactions: Transaction[]
  income: number
  expenses: number
}

const MonthlyReport = ({ month, transactions, income, expenses }: MonthlyReportProps) => {
  const { categories } = useStore()

  // Group transactions by category
  const categoryBreakdown = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { income: 0, expenses: 0, transactions: [] }
    }
    
    if (t.type === 'income') {
      acc[t.category].income += t.amount
    } else {
      acc[t.category].expenses += t.amount
    }
    
    acc[t.category].transactions.push(t)
    return acc
  }, {} as Record<string, { income: number, expenses: number, transactions: Transaction[] }>)

  // Sort categories by total amount
  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => (b.income + b.expenses) - (a.income + a.expenses))

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.icon || '📊'
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.color || '#6b7280'
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No transactions recorded for {format(month, 'MMMM yyyy')}.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-2xl font-bold text-success-600">${income.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold text-danger-600">${expenses.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Net Balance</p>
          <p className={`text-2xl font-bold ${income - expenses >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            ${(income - expenses).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h4>
        <div className="space-y-4">
          {sortedCategories.map(([categoryName, data]) => {
            const total = data.income + data.expenses
            const category = categories.find(c => c.name === categoryName)
            
            return (
              <div key={categoryName} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${getCategoryColor(categoryName)}20` }}
                    >
                      {getCategoryIcon(categoryName)}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{categoryName}</h5>
                      <p className="text-sm text-gray-500 capitalize">
                        {category?.type || 'Unknown'} Category
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {((total / (income + expenses)) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>

                {/* Income/Expense breakdown */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-success-50 rounded">
                    <p className="text-success-600 font-medium">Income</p>
                    <p className="text-success-700">${data.income.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-2 bg-danger-50 rounded">
                    <p className="text-danger-600 font-medium">Expenses</p>
                    <p className="text-danger-700">${data.expenses.toFixed(2)}</p>
                  </div>
                </div>

                {/* Recent transactions */}
                {data.transactions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Recent transactions:</p>
                    <div className="space-y-1">
                      {data.transactions.slice(0, 3).map((t) => (
                        <div key={t.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {t.description || t.category} - {format(new Date(t.date), 'MMM dd')}
                          </span>
                          <span className={`font-medium ${
                            t.type === 'income' ? 'text-success-600' : 'text-danger-600'
                          }`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {data.transactions.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{data.transactions.length - 3} more transactions
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction List */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">All Transactions</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {transaction.description || 'No description'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <span className={transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MonthlyReport
