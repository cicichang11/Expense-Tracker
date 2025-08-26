import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'

interface StatCardProps {
  title: string
  value: number
  change: number
  icon: LucideIcon
  type: 'income' | 'expense' | 'balance'
}

const StatCard = ({ title, value, change, icon: Icon, type }: StatCardProps) => {
  const isPositive = change >= 0
  const changePercentage = Math.abs((change / (value - change)) * 100) || 0

  const getValueColor = () => {
    if (type === 'balance') {
      return value >= 0 ? 'text-success-600' : 'text-danger-600'
    }
    if (type === 'income') {
      return 'text-success-600'
    }
    return 'text-danger-600'
  }

  const getChangeColor = () => {
    if (type === 'balance') {
      return change >= 0 ? 'text-success-600' : 'text-danger-600'
    }
    if (type === 'income') {
      return change >= 0 ? 'text-success-600' : 'text-danger-600'
    }
    return change <= 0 ? 'text-success-600' : 'text-danger-600'
  }

  return (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={clsx(
            'p-3 rounded-lg',
            type === 'income' && 'bg-success-100',
            type === 'expense' && 'bg-danger-100',
            type === 'balance' && 'bg-primary-100'
          )}>
            <Icon className={clsx(
              'h-6 w-6',
              type === 'income' && 'text-success-600',
              type === 'expense' && 'text-danger-600',
              type === 'balance' && 'text-primary-600'
            )} />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={clsx('text-2xl font-bold', getValueColor())}>
            ${Math.abs(value).toFixed(2)}
          </p>
        </div>
      </div>
      
      {change !== 0 && (
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-success-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-danger-500" />
          )}
          <span className={clsx('ml-2 text-sm font-medium', getChangeColor())}>
            {isPositive ? '+' : '-'}${Math.abs(change).toFixed(2)}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            ({changePercentage.toFixed(1)}%)
          </span>
        </div>
      )}
    </div>
  )
}

export default StatCard
