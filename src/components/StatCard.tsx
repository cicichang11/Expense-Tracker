import { TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'

interface StatCardProps {
  title: string
  value: number
  change?: number
  changeLabel?: string
  suffix?: string
  type: 'success' | 'danger' | 'warning'
}

const StatCard = ({ title, value, change, changeLabel, suffix, type }: StatCardProps) => {
  const isPositive = change ? change >= 0 : true
  const changePercentage = change ? Math.abs((change / (value - change)) * 100) || 0 : 0

  const getValueColor = () => {
    if (type === 'success') return 'text-success-600 dark:text-success-400'
    if (type === 'danger') return 'text-danger-600 dark:text-danger-400'
    if (type === 'warning') return 'text-warning-600 dark:text-warning-400'
    return 'text-gray-900 dark:text-gray-100'
  }

  const getChangeColor = () => {
    if (type === 'success') return 'text-success-600 dark:text-success-400'
    if (type === 'danger') return 'text-danger-600 dark:text-danger-400'
    if (type === 'warning') return 'text-warning-600 dark:text-warning-400'
    return change && change >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
  }

  const getIconColor = () => {
    if (type === 'success') return 'text-success-500 dark:text-success-400'
    if (type === 'danger') return 'text-danger-500 dark:text-danger-400'
    if (type === 'warning') return 'text-warning-500 dark:text-warning-400'
    return change && change >= 0 ? 'text-success-500 dark:text-success-400' : 'text-danger-500 dark:text-danger-400'
  }

  return (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className={clsx('text-2xl font-bold', getValueColor())}>
            {suffix ? `${value.toFixed(2)}${suffix}` : `$${Math.abs(value).toFixed(2)}`}
          </p>
        </div>
      </div>
      
      {change !== undefined && change !== 0 && (
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <TrendingUp className={clsx('h-4 w-4', getIconColor())} />
          ) : (
            <TrendingDown className={clsx('h-4 w-4', getIconColor())} />
          )}
          <span className={clsx('ml-2 text-sm font-medium', getChangeColor())}>
            {isPositive ? '+' : '-'}${Math.abs(change).toFixed(2)}
          </span>
          {changeLabel && (
            <span className="ml-2 text-sm text-muted">
              {changeLabel}
            </span>
          )}
          {changePercentage > 0 && (
            <span className="ml-2 text-sm text-muted">
              ({changePercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default StatCard
