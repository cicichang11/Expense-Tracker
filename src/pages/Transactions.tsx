import { useState } from 'react'
import { Search, Filter, SortAsc, SortDesc, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'
import TransactionList from '../components/TransactionList'
import TransactionModal from '../components/TransactionModal'
import FilterModal from '../components/FilterModal'

const Transactions = () => {
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  
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
      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all your income and expenses
          </p>
        </div>
        <button
          onClick={() => setShowTransactionModal(true)}
          className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
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
                onChange={(e) => setFilterOptions({ search: e.target.value })}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterModal(true)}
            className={`btn-secondary flex items-center gap-2 ${
              hasActiveFilters ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(filterOptions).filter(v => v !== undefined && v !== 'all' && v !== '').length}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filterOptions.type && filterOptions.type !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Type: {filterOptions.type}
              </span>
            )}
            {filterOptions.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Category: {filterOptions.category}
              </span>
            )}
            {filterOptions.dateRange && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Date Range: {filterOptions.dateRange.start} to {filterOptions.dateRange.end}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All Transactions ({transactions.length})
          </h2>
          
          {/* Sort Options */}
          <div className="flex items-center gap-1 text-sm">
            <span className="text-gray-500 mr-2">Sort by:</span>
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
    </div>
  )
}

export default Transactions
