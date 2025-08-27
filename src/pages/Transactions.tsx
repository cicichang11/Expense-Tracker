import { useState } from 'react'
import { Search, Filter, SortAsc, SortDesc, Plus, Download } from 'lucide-react'
import { useStore } from '../store/useStore'
import TransactionList from '../components/TransactionList'
import TransactionModal from '../components/TransactionModal'
import FilterModal from '../components/FilterModal'
import ExportModal from '../components/ExportModal'
import { format } from 'date-fns'

const Transactions = () => {
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  
  const {
    filterOptions,
    sortOptions,
    setFilterOptions,
    setSortOptions,
    clearFilters,
    getFilteredTransactions
  } = useStore()

  const transactions = getFilteredTransactions()
  const hasActiveFilters = Object.values(filterOptions).some(value => 
    value !== undefined && value !== 'all' && value !== ''
  )

  const handleSort = (field: 'date' | 'amount' | 'description' | 'category') => {
    const newDirection = sortOptions.field === field && sortOptions.direction === 'asc' ? 'desc' : 'asc'
    setSortOptions({ field, direction: newDirection })
  }

  const SortButton = ({ field, children }: { field: 'date' | 'amount' | 'description' | 'category', children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 px-3 py-1 text-sm text-muted hover:text-heading hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
    >
      {children}
      {sortOptions.field === field && (
        sortOptions.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Transactions</h1>
          <p className="mt-2 text-sm text-muted">
            Manage and track all your income and expenses
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowExportModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowTransactionModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filterOptions.search || ''}
                onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg-secondary dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Filter and Sort Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterModal(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            
            {/* Sort Buttons */}
            <div className="flex items-center gap-1 border border-gray-200 dark:border-dark-border rounded-lg p-1">
              <SortButton field="date">Date</SortButton>
              <SortButton field="amount">Amount</SortButton>
              <SortButton field="description">Description</SortButton>
              <SortButton field="category">Category</SortButton>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted">Active filters:</span>
            {filterOptions.type && filterOptions.type !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200">
                Type: {filterOptions.type}
              </span>
            )}
            {filterOptions.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200">
                Category: {filterOptions.category}
              </span>
            )}
            {filterOptions.dateRange?.start && filterOptions.dateRange?.end && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200">
                Date: {format(new Date(filterOptions.dateRange.start), 'MMM dd')} - {format(new Date(filterOptions.dateRange.end), 'MMM dd')}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-danger-600 dark:text-danger-400 hover:text-danger-800 dark:hover:text-danger-300 font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-heading">
            All Transactions ({transactions.length})
          </h2>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted mr-2">Sort by:</span>
            <SortButton field="date">Date</SortButton>
            <SortButton field="amount">Amount</SortButton>
            <SortButton field="description">Description</SortButton>
            <SortButton field="category">Category</SortButton>
          </div>
        </div>
        
        <TransactionList transactions={transactions} />
      </div>

      {/* Modals */}
      <TransactionModal
        open={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />
      
      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        onApplyFilters={setFilterOptions}
      />

      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  )
}

export default Transactions
