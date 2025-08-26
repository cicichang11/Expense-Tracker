import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Transaction, TransactionFormData } from '../types'

interface TransactionModalProps {
  open: boolean
  onClose: () => void
}

const TransactionModal = ({ open, onClose }: TransactionModalProps) => {
  const { 
    editingTransaction, 
    addTransaction, 
    updateTransaction, 
    closeTransactionModal,
    categories 
  } = useStore()

  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    type: 'expense',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({})

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        description: editingTransaction.description || '',
        category: editingTransaction.category,
        date: editingTransaction.date
      })
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      })
    }
    setErrors({})
  }, [editingTransaction])

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const transactionData = {
      id: editingTransaction?.id || crypto.randomUUID(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      createdAt: editingTransaction?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData)
    } else {
      addTransaction(transactionData)
    }

    handleClose()
  }

  const handleClose = () => {
    closeTransactionModal()
    onClose()
  }

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

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
                      {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Transaction Type */}
                      <div>
                        <label className="label">Transaction Type</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="type"
                              value="expense"
                              checked={formData.type === 'expense'}
                              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                              className="mr-2"
                            />
                            Expense
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="type"
                              value="income"
                              checked={formData.type === 'income'}
                              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                              className="mr-2"
                            />
                            Income
                          </label>
                        </div>
                      </div>

                      {/* Amount */}
                      <div>
                        <label htmlFor="amount" className="label">
                          Amount
                        </label>
                        <input
                          type="number"
                          id="amount"
                          step="0.01"
                          min="0"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className={`input ${errors.amount ? 'border-danger-500' : ''}`}
                          placeholder="0.00"
                        />
                        {errors.amount && (
                          <p className="mt-1 text-sm text-danger-600">{errors.amount}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="description" className="label">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="input"
                          placeholder="Enter description..."
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label htmlFor="category" className="label">
                          Category
                        </label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className={`input ${errors.category ? 'border-danger-500' : ''}`}
                        >
                          <option value="">Select a category</option>
                          {filteredCategories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-danger-600">{errors.category}</p>
                        )}
                      </div>

                      {/* Date */}
                      <div>
                        <label htmlFor="date" className="label">
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className={`input ${errors.date ? 'border-danger-500' : ''}`}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-danger-600">{errors.date}</p>
                        )}
                      </div>

                      {/* Form Actions */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          {editingTransaction ? 'Update' : 'Add'} Transaction
                        </button>
                      </div>
                    </form>
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

export default TransactionModal
