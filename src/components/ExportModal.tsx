import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Download, FileText, BarChart3 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ExportOptions } from '../types'
import {
  exportTransactionsToCSV,
  exportBudgetReportToCSV,
  exportCategorySummaryToCSV,
  downloadCSV,
  generateFilename
} from '../utils/exportUtils'

interface ExportModalProps {
  open: boolean
  onClose: () => void
}

const ExportModal = ({ open, onClose }: ExportModalProps) => {
  const { transactions, categories, budgets } = useStore()
  
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    categories: [],
    includeCharts: false
  })

  const [selectedExportType, setSelectedExportType] = useState<'transactions' | 'budget' | 'summary'>('transactions')

  const handleExport = () => {
    try {
      let csvContent: string
      let filename: string

      switch (selectedExportType) {
        case 'transactions':
          // Filter transactions by date range and selected categories
          let filteredTransactions = transactions.filter(t => {
            const date = new Date(t.date)
            const start = new Date(exportOptions.dateRange!.start)
            const end = new Date(exportOptions.dateRange!.end)
            
            const dateMatch = date >= start && date <= end
            const categoryMatch = exportOptions.categories!.length === 0 || 
              exportOptions.categories!.includes(t.category)
            
            return dateMatch && categoryMatch
          })

          csvContent = exportTransactionsToCSV(filteredTransactions)
          filename = generateFilename('transactions', exportOptions.dateRange)
          break

        case 'budget':
          csvContent = exportBudgetReportToCSV(
            budgets,
            categories,
            transactions,
            exportOptions.dateRange!.start,
            exportOptions.dateRange!.end
          )
          filename = generateFilename('budget-report', exportOptions.dateRange)
          break

        case 'summary':
          csvContent = exportCategorySummaryToCSV(
            categories,
            transactions,
            exportOptions.dateRange!.start,
            exportOptions.dateRange!.end
          )
          filename = generateFilename('category-summary', exportOptions.dateRange)
          break

        default:
          throw new Error('Invalid export type')
      }

      downloadCSV(csvContent, filename)
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const handleCategoryToggle = (categoryName: string) => {
    setExportOptions(prev => ({
      ...prev,
      categories: prev.categories!.includes(categoryName)
        ? prev.categories!.filter(c => c !== categoryName)
        : [...prev.categories!, categoryName]
    }))
  }

  const exportTypes = [
    {
      id: 'transactions',
      name: 'Transactions',
      description: 'Export all transactions with details',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 'budget',
      name: 'Budget Report',
      description: 'Export budget utilization and spending',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      id: 'summary',
      name: 'Category Summary',
      description: 'Export spending summary by category',
      icon: BarChart3,
      color: 'text-purple-600'
    }
  ]

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                      Export Data
                    </Dialog.Title>

                    <div className="space-y-6">
                      {/* Export Type Selection */}
                      <div>
                        <label className="label">Export Type</label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          {exportTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setSelectedExportType(type.id as any)}
                              className={`p-4 border rounded-lg text-left transition-all ${
                                selectedExportType === type.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <type.icon className={`h-5 w-5 ${type.color}`} />
                                <div>
                                  <h4 className="font-medium text-gray-900">{type.name}</h4>
                                  <p className="text-sm text-gray-500">{type.description}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date Range */}
                      <div>
                        <label className="label">Date Range</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500">From</label>
                            <input
                              type="date"
                              value={exportOptions.dateRange?.start || ''}
                              onChange={(e) => setExportOptions(prev => ({
                                ...prev,
                                dateRange: { ...prev.dateRange!, start: e.target.value }
                              }))}
                              className="input text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">To</label>
                            <input
                              type="date"
                              value={exportOptions.dateRange?.end || ''}
                              onChange={(e) => setExportOptions(prev => ({
                                ...prev,
                                dateRange: { ...prev.dateRange!, end: e.target.value }
                              }))}
                              className="input text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Category Filter (only for transactions) */}
                      {selectedExportType === 'transactions' && (
                        <div>
                          <label className="label">Categories (Optional)</label>
                          <p className="text-sm text-gray-500 mb-3">
                            Leave empty to export all categories
                          </p>
                          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {categories.map((category) => (
                              <label key={category.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={exportOptions.categories!.includes(category.name)}
                                  onChange={() => handleCategoryToggle(category.name)}
                                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {category.icon} {category.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Export Format */}
                      <div>
                        <label className="label">Export Format</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="format"
                              value="csv"
                              checked={exportOptions.format === 'csv'}
                              onChange={(e) => setExportOptions(prev => ({
                                ...prev,
                                format: e.target.value as 'csv' | 'pdf'
                              }))}
                              className="mr-2"
                            />
                            CSV (Excel, Google Sheets)
                          </label>
                          <label className="flex items-center text-gray-400">
                            <input
                              type="radio"
                              name="format"
                              value="pdf"
                              disabled
                              className="mr-2"
                            />
                            PDF (Coming Soon)
                          </label>
                        </div>
                      </div>

                      {/* Export Preview */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Export Preview</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Type: {exportTypes.find(t => t.id === selectedExportType)?.name}</p>
                          <p>Format: {exportOptions.format.toUpperCase()}</p>
                          <p>Date Range: {exportOptions.dateRange?.start} to {exportOptions.dateRange?.end}</p>
                          {selectedExportType === 'transactions' && exportOptions.categories!.length > 0 && (
                            <p>Categories: {exportOptions.categories!.join(', ')}</p>
                          )}
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleExport}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Export {exportOptions.format.toUpperCase()}
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

export default ExportModal
