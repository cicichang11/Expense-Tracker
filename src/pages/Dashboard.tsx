import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { format } from 'date-fns'
import StatCard from '../components/StatCard'
import RecentTransactions from '../components/RecentTransactions'
import ExpenseChart from '../components/ExpenseChart'
import BalanceChart from '../components/BalanceChart'
import BudgetChart from '../components/BudgetChart'

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your financial status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={stats.balance}
          change={stats.monthlyBalance}
          icon={DollarSign}
          type="balance"
        />
        <StatCard
          title="Monthly Income"
          value={stats.monthlyIncome}
          change={stats.monthlyIncome - (stats.totalIncome / 12)}
          icon={TrendingUp}
          type="income"
        />
        <StatCard
          title="Monthly Expenses"
          value={stats.monthlyExpenses}
          change={stats.monthlyExpenses - (stats.totalExpenses / 12)}
          icon={TrendingDown}
          type="expense"
        />
        <StatCard
          title="This Month"
          value={stats.monthlyBalance}
          change={stats.monthlyBalance}
          icon={Calendar}
          type="balance"
        />
      </div>

      {/* Budget Overview - New Section */}
      {activeBudgets.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-primary-100">
                  <Target className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Budget Usage</p>
                <p className={`text-2xl font-bold ${
                  stats.budgetUtilization <= 80 
                    ? 'text-success-600' 
                    : stats.budgetUtilization <= 100 
                    ? 'text-warning-600' 
                    : 'text-danger-600'
                }`}>
                  {stats.budgetUtilization.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-warning-100">
                  <AlertTriangle className="h-6 w-6 text-warning-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Over Budget</p>
                <p className="text-2xl font-bold text-warning-600">
                  {stats.overspentCategories.length}
                </p>
                <p className="text-sm text-gray-500">categories</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-success-100">
                  <div className="h-6 w-6 text-success-600">🎯</div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Goals</p>
                <p className="text-2xl font-bold text-success-600">
                  {goals.length}
                </p>
                <p className="text-sm text-gray-500">in progress</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <ExpenseChart />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Trend</h3>
          <BalanceChart />
        </div>
      </div>

      {/* Budget Chart - New Section */}
      {activeBudgets.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
          <BudgetChart />
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <a
            href="/transactions"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
          </a>
        </div>
        <RecentTransactions transactions={recentTransactions} />
      </div>

      {/* Upcoming Goals - New Section */}
      {stats.upcomingGoals.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Goals</h3>
            <a
              href="/goals"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.upcomingGoals.map((goal) => (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <span className="text-xs text-gray-500 capitalize">{goal.type}</span>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
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
