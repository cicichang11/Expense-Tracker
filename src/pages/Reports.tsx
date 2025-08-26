import { useState } from 'react'
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { useStore } from '../store/useStore'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import ExpenseChart from '../components/ExpenseChart'
import BalanceChart from '../components/BalanceChart'
import MonthlyReport from '../components/MonthlyReport'

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const { transactions, categories, getDashboardStats } = useStore()

  const stats = getDashboardStats()

  // Generate month options for the last 12 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      value: date,
      label: format(date, 'MMMM yyyy')
    }
  })

  // Get transactions for selected month
  const getMonthTransactions = () => {
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= start && transactionDate <= end
    })
  }

  const monthTransactions = getMonthTransactions()
  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const monthExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Top spending categories
  const topCategories = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const topSpendingCategories = Object.entries(topCategories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / monthExpenses) * 100
    }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            Detailed insights into your financial patterns and trends
          </p>
        </div>
        
        {/* Month Selector */}
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedMonth.toISOString()}
            onChange={(e) => setSelectedMonth(new Date(e.target.value))}
            className="input max-w-xs"
          >
            {monthOptions.map((option) => (
              <option key={option.value.toISOString()} value={option.value.toISOString()}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-success-100">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Income</p>
              <p className="text-2xl font-bold text-success-600">
                ${monthIncome.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-danger-100">
                <TrendingDown className="h-6 w-6 text-danger-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Expenses</p>
              <p className="text-2xl font-bold text-danger-600">
                ${monthExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${
                monthIncome - monthExpenses >= 0 ? 'bg-success-100' : 'bg-danger-100'
              }`}>
                <div className={`h-6 w-6 ${
                  monthIncome - monthExpenses >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {monthIncome - monthExpenses >= 0 ? '💰' : '📉'}
                </div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Balance</p>
              <p className={`text-2xl font-bold ${
                monthIncome - monthExpenses >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                ${(monthIncome - monthExpenses).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Breakdown - {format(selectedMonth, 'MMMM yyyy')}
          </h3>
          <ExpenseChart />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Trend</h3>
          <BalanceChart />
        </div>
      </div>

      {/* Top Spending Categories */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Spending Categories - {format(selectedMonth, 'MMMM yyyy')}
        </h3>
        {topSpendingCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No expenses recorded for this month.
          </div>
        ) : (
          <div className="space-y-4">
            {topSpendingCategories.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${item.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Report */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Monthly Report</h3>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
        <MonthlyReport 
          month={selectedMonth}
          transactions={monthTransactions}
          income={monthIncome}
          expenses={monthExpenses}
        />
      </div>
    </div>
  )
}

export default Reports
