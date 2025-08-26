import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { FilterOptions } from '../types'

interface FilterModalProps {
  open: boolean
  onClose: () => void
  filterOptions: FilterOptions
  onApplyFilters: (filters: Partial<FilterOptions>) => void
}

const FilterModal = ({ open, onClose, filterOptions, onApplyFilters }: FilterModalProps) => {
  const { categories } = useStore()
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions)

  useEffect(() => {
    setLocalFilters(filterOptions)
  }, [filterOptions])

  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters({ type: 'all' })
  }

  const handleClose = () => {
    setLocalFilters(filterOptions)
    onClose()
  }

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                      Filter Transactions
                    </Dialog.Title>

                    <div className="space-y-4">
                      {/* Transaction Type */}
                      <div>
                        <label className="label">Transaction Type</label>
                        <select
                          value={localFilters.type || 'all'}
                          onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value as 'income' | 'expense' | 'all' })}
                          className="input"
                        >
                          <option value="all">All Types</option>
                          <option value="income">Income Only</option>
                          <option value="expense">Expense Only</option>
                        </select>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="label">Category</label>
                        <select
                          value={localFilters.category || ''}
                          onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value || undefined })}
                          className="input"
                        >
                          <option value="">All Categories</option>
                          {localFilters.type === 'income' || localFilters.type === 'all' ? (
                            <optgroup label="Income Categories">
                              {incomeCategories.map((category) => (
                                <option key={category.id} value={category.name}>
                                  {category.icon} {category.name}
                                </option>
                              ))}
                            </optgroup>
                          ) : null}
                          {localFilters.type === 'expense' || localFilters.type === 'all' ? (
                            <optgroup label="Expense Categories">
                              {expenseCategories.map((category) => (
                                <option key={category.id} value={category.name}>
                                  {category.icon} {category.name}
                                </option>
                              ))}
                            </optgroup>
                          ) : null}
                        </select>
                      </div>

                      {/* Date Range */}
                      <div>
                        <label className="label">Date Range (Optional)</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500">From</label>
                            <input
                              type="date"
                              value={localFilters.dateRange?.start || ''}
                              onChange={(e) => setLocalFilters({
                                ...localFilters,
                                dateRange: {
                                  ...localFilters.dateRange,
                                  start: e.target.value
                                }
                              })}
                              className="input text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">To</label>
                            <input
                              type="date"
                              value={localFilters.dateRange?.end || ''}
                              onChange={(e) => setLocalFilters({
                                ...localFilters,
                                dateRange: {
                                  ...localFilters.dateRange,
                                  end: e.target.value
                                }
                              })}
                              className="input text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="btn-secondary"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleApply}
                          className="btn-primary"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default FilterModal
