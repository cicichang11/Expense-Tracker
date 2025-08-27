import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { format } from 'date-fns'
import StatCard from '../components/StatCard'
import RecentTransactions from '../components/RecentTransactions'
import ExpenseChart from '../components/ExpenseChart'
import BalanceChart from '../components/BalanceChart'
import BudgetChart from '../components/BudgetChart'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const stats = useStore((state) => state.getDashboardStats())
  const transactions = useStore((state) => state.getFilteredTransactions())
  const budgets = useStore((state) => state.budgets)
  const goals = useStore((state) => state.getActiveGoals())

  const recentTransactions = transactions.slice(0, 5)
  const activeBudgets = budgets.filter(b => b.isActive)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Welcome back! Here's an overview of your financial status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={stats.balance}
          change={stats.monthlyBalance}
          changeLabel="vs last month"
          type={stats.balance >= 0 ? 'success' : 'danger'}
        />
        <StatCard
          title="Monthly Income"
          value={stats.monthlyIncome}
          change={stats.monthlyIncomeChange}
          changeLabel="vs last month"
          type="success"
        />
        <StatCard
          title="Monthly Expenses"
          value={stats.monthlyExpenses}
          change={stats.monthlyExpensesChange}
          changeLabel="vs last month"
          type="danger"
        />
        <StatCard
          title="Budget Usage"
          value={stats.budgetUtilization}
          suffix="%"
          type={stats.budgetUtilization <= 80 ? 'success' : stats.budgetUtilization <= 100 ? 'warning' : 'danger'}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-heading mb-4">Expense Breakdown</h3>
          <ExpenseChart />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-heading mb-4">Balance Trend</h3>
          <BalanceChart />
        </div>
      </div>

      {/* Budget Overview */}
      {stats.budgetUtilization > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-heading mb-4">Budget Overview</h3>
          <BudgetChart />
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-heading">Recent Transactions</h3>
          <Link to="/transactions" className="text-sm text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400 dark:hover:text-primary-300">
            View all
          </Link>
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>

      {/* Upcoming Goals */}
      {stats.upcomingGoals.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-heading">Upcoming Goals</h3>
            <Link to="/goals" className="text-sm text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400 dark:hover:text-primary-300">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.upcomingGoals.map((goal) => (
              <div key={goal.id} className="p-4 border border-gray-200 dark:border-dark-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-heading">{goal.name}</h4>
                  <span className="text-xs text-muted capitalize">{goal.type}</span>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted">Progress</span>
                    <span className="font-medium text-heading">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 dark:bg-primary-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted">
                  Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
