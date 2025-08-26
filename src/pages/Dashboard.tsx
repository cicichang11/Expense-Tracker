import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { useStore } from '../store/useStore'
import { format } from 'date-fns'
import StatCard from '../components/StatCard'
import RecentTransactions from '../components/RecentTransactions'
import ExpenseChart from '../components/ExpenseChart'
import BalanceChart from '../components/BalanceChart'

const Dashboard = () => {
  const stats = useStore((state) => state.getDashboardStats())
  const transactions = useStore((state) => state.getFilteredTransactions())

  const recentTransactions = transactions.slice(0, 5)

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
    </div>
  )
}

export default Dashboard
