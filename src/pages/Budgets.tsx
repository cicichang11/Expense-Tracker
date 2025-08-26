import { useState } from 'react'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle, Download } from 'lucide-react'
import { useStore } from '../store/useStore'
import BudgetModal from '../components/BudgetModal'
import BudgetChart from '../components/BudgetChart'
import ExportModal from '../components/ExportModal'

const Budgets = () => {
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  
  const { 
    budgets, 
    categories, 
    deleteBudget, 
    getBudgetUtilization,
    openBudgetModal,
    closeBudgetModal
  } = useStore()

  const handleEdit = (budget: any) => {
    openBudgetModal(budget)
    setShowBudgetModal(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id)
    }
  }

  const handleAddNew = () => {
    openBudgetModal() // Open modal without editing any budget
    setShowBudgetModal(true)
  }

  const handleCloseModal = () => {
    closeBudgetModal()
    setShowBudgetModal(false)
  }

  const activeBudgets = budgets.filter(b => b.isActive)
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Calculate budget statistics
  const totalBudget = activeBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = activeBudgets.reduce((sum, b) => {
    const utilization = getBudgetUtilization(b.categoryId, startOfMonth.toISOString(), endOfMonth.toISOString())
    return sum + utilization.spent
  }, 0)
  const totalRemaining = totalBudget - totalSpent
  const overallUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  // Get budgets with utilization data
  const budgetsWithUtilization = activeBudgets.map(budget => {
    const category = categories.find(c => c.id === budget.categoryId)
    const utilization = getBudgetUtilization(budget.categoryId, startOfMonth.toISOString(), endOfMonth.toISOString())
    
    return {
      ...budget,
      categoryName: category?.name || 'Unknown',
      categoryIcon: category?.icon || '📊',
      categoryColor: category?.color || '#6b7280',
      ...utilization
    }
  })

  const BudgetCard = ({ budget }: { budget: any }) => (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: `${budget.categoryColor}20` }}
          >
            {budget.categoryIcon}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{budget.categoryName}</h4>
            <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(budget)}
            className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
            title="Edit budget"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(budget.id)}
            className="text-danger-600 hover:text-danger-900 p-1 rounded-md hover:bg-danger-50"
            title="Delete budget"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Budget Amount */}
      <div className="mb-3">
        <p className="text-sm text-gray-600">Budget Amount</p>
        <p className="text-lg font-semibold text-gray-900">${budget.amount.toFixed(2)}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className={`font-medium ${
            budget.percentage <= 80 
              ? 'text-success-600' 
              : budget.percentage <= 100 
              ? 'text-warning-600' 
              : 'text-danger-600'
          }`}>
            {budget.percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              budget.percentage <= 80 
                ? 'bg-success-500' 
                : budget.percentage <= 100 
                ? 'bg-warning-500' 
                : 'bg-danger-500'
            }`}
            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Spending Details */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-600">Spent</p>
          <p className="font-medium text-danger-600">${budget.spent.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600">Remaining</p>
          <p className={`font-medium ${budget.remaining >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            ${budget.remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Warning for over budget */}
      {budget.remaining < 0 && (
        <div className="mt-3 p-2 bg-danger-50 border border-danger-200 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-danger-600" />
            <span className="text-sm text-danger-800">
              Over budget by ${Math.abs(budget.remaining).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Date Range */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {new Date(budget.startDate).toLocaleDateString()} - {
            budget.endDate 
              ? new Date(budget.endDate).toLocaleDateString()
              : 'Ongoing'
          }
        </p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="mt-2 text-sm text-gray-600">
            Set and track spending limits for your expense categories
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
          <button
            onClick={handleAddNew}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Set Budget
          </button>
        </div>
      </div>

      {/* Budget Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-primary-100">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Budget</p>
              <p className="text-2xl font-bold text-primary-600">
                ${totalBudget.toFixed(2)}
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
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-danger-600">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${
                totalRemaining >= 0 ? 'bg-success-100' : 'bg-danger-100'
              }`}>
                <div className={`h-6 w-6 ${
                  totalRemaining >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {totalRemaining >= 0 ? '💰' : '📉'}
                </div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Remaining</p>
              <p className={`text-2xl font-bold ${
                totalRemaining >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                ${totalRemaining.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${
                overallUtilization <= 80 
                  ? 'bg-success-100' 
                  : overallUtilization <= 100 
                  ? 'bg-warning-100' 
                  : 'bg-danger-100'
              }`}>
                <div className={`h-6 w-6 ${
                  overallUtilization <= 80 
                    ? 'text-success-600' 
                    : overallUtilization <= 100 
                    ? 'text-warning-600' 
                    : 'text-danger-600'
                }`}>
                  📊
                </div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Utilization</p>
              <p className={`text-2xl font-bold ${
                overallUtilization <= 80 
                  ? 'text-success-600' 
                  : overallUtilization <= 100 
                  ? 'text-warning-600' 
                  : 'text-danger-600'
              }`}>
                {overallUtilization.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
        <BudgetChart />
      </div>

      {/* Budget List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Budgets ({activeBudgets.length})
          </h3>
        </div>

        {activeBudgets.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto" />
            </div>
            <p className="text-lg font-medium mb-2">No budgets set yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Set budgets for your expense categories to start tracking your spending
            </p>
            <button
              onClick={handleAddNew}
              className="btn-primary"
            >
              Set Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetsWithUtilization.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div>
        )}
      </div>

      {/* Budget Modal */}
      <BudgetModal
        open={showBudgetModal}
        onClose={handleCloseModal}
      />

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  )
}

export default Budgets
