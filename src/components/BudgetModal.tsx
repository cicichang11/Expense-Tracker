import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { BudgetFormData } from '../types'

interface BudgetModalProps {
  open: boolean
  onClose: () => void
}

const BudgetModal = ({ open, onClose }: BudgetModalProps) => {
  const { 
    editingBudget, 
    addBudget, 
    updateBudget, 
    closeBudgetModal,
    categories 
  } = useStore()

  const [formData, setFormData] = useState<BudgetFormData>({
    categoryId: '',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  })

  const [errors, setErrors] = useState<Partial<BudgetFormData>>({})

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        categoryId: editingBudget.categoryId,
        amount: editingBudget.amount.toString(),
        period: editingBudget.period,
        startDate: editingBudget.startDate,
        endDate: editingBudget.endDate || ''
      })
    } else {
      setFormData({
        categoryId: '',
        amount: '',
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      })
    }
    setErrors({})
  }, [editingBudget])

  const validateForm = (): boolean => {
    const newErrors: Partial<BudgetFormData> = {}

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const budgetData = {
      id: editingBudget?.id || crypto.randomUUID(),
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      isActive: true,
      createdAt: editingBudget?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData)
    } else {
      addBudget(budgetData)
    }

    handleClose()
  }

  const handleClose = () => {
    closeBudgetModal()
    onClose()
  }

  const expenseCategories = categories.filter(cat => cat.type === 'expense')

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
                      {editingBudget ? 'Edit Budget' : 'Set New Budget'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Category */}
                      <div>
                        <label htmlFor="categoryId" className="label">
                          Category
                        </label>
                        <select
                          id="categoryId"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                          className={`input ${errors.categoryId ? 'border-danger-500' : ''}`}
                        >
                          <option value="">Select a category</option>
                          {expenseCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.categoryId && (
                          <p className="mt-1 text-sm text-danger-600">{errors.categoryId}</p>
                        )}
                      </div>

                      {/* Amount */}
                      <div>
                        <label htmlFor="amount" className="label">
                          Budget Amount
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

                      {/* Period */}
                      <div>
                        <label className="label">Budget Period</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="period"
                              value="monthly"
                              checked={formData.period === 'monthly'}
                              onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' })}
                              className="mr-2"
                            />
                            Monthly
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="period"
                              value="yearly"
                              checked={formData.period === 'yearly'}
                              onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' })}
                              className="mr-2"
                            />
                            Yearly
                          </label>
                        </div>
                      </div>

                      {/* Start Date */}
                      <div>
                        <label htmlFor="startDate" className="label">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className={`input ${errors.startDate ? 'border-danger-500' : ''}`}
                        />
                        {errors.startDate && (
                          <p className="mt-1 text-sm text-danger-600">{errors.startDate}</p>
                        )}
                      </div>

                      {/* End Date (Optional) */}
                      <div>
                        <label htmlFor="endDate" className="label">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className={`input ${errors.endDate ? 'border-danger-500' : ''}`}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Leave empty for ongoing budget
                        </p>
                        {errors.endDate && (
                          <p className="mt-1 text-sm text-danger-600">{errors.endDate}</p>
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
                          {editingBudget ? 'Update' : 'Set'} Budget
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

export default BudgetModal
