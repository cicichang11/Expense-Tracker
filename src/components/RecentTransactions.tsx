import { Transaction } from '../types'
import { format } from 'date-fns'
import { useStore } from '../store/useStore'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const categories = useStore((state) => state.categories)

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
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions yet. Add your first transaction to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${getCategoryColor(transaction.category)}20` }}
            >
              {getCategoryIcon(transaction.category)}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {transaction.description || transaction.category}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${
              transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{transaction.category}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentTransactions
