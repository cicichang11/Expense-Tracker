import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Category, CategoryFormData } from '../types'

interface CategoryModalProps {
  open: boolean
  onClose: () => void
  editingCategory: Category | null
}

const CategoryModal = ({ open, onClose, editingCategory }: CategoryModalProps) => {
  const { addCategory, updateCategory } = useStore()

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    type: 'expense',
    color: '#3b82f6',
    icon: '📊'
  })

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({})

  const iconOptions = [
    '💼', '💻', '📈', '🍽️', '🚗', '🛍️', '📱', '🎬', '🏠', '✈️', '🎓', '💊',
    '🎨', '🎵', '🏃', '🧘', '🍕', '☕', '🍺', '🎮', '📚', '💡', '🔧', '🎁'
  ]

  const colorOptions = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
    '#a855f7', '#ec4899', '#f43f5e'
  ]

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        type: editingCategory.type,
        color: editingCategory.color,
        icon: editingCategory.icon
      })
    } else {
      setFormData({
        name: '',
        type: 'expense',
        color: '#3b82f6',
        icon: '📊'
      })
    }
    setErrors({})
  }, [editingCategory])

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }

    if (formData.name.length > 20) {
      newErrors.name = 'Category name must be less than 20 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const categoryData = {
      id: editingCategory?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      type: formData.type,
      color: formData.color,
      icon: formData.icon,
      createdAt: editingCategory?.createdAt || new Date().toISOString()
    }

    if (editingCategory && editingCategory.id) {
      updateCategory(editingCategory.id, categoryData)
    } else {
      addCategory(categoryData)
    }

    onClose()
  }

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                      {editingCategory && editingCategory.id ? 'Edit Category' : 'Add New Category'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Transaction Type */}
                      <div>
                        <label className="label">Category Type</label>
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

                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="label">
                          Category Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`input ${errors.name ? 'border-danger-500' : ''}`}
                          placeholder="Enter category name..."
                          maxLength={20}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
                        )}
                      </div>

                      {/* Icon Selection */}
                      <div>
                        <label className="label">Icon</label>
                        <div className="grid grid-cols-8 gap-2">
                          {iconOptions.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => setFormData({ ...formData, icon })}
                              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                                formData.icon === icon
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Selection */}
                      <div>
                        <label className="label">Color</label>
                        <div className="grid grid-cols-5 gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setFormData({ ...formData, color })}
                              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                formData.color === color
                                  ? 'border-gray-900 scale-110'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Preview */}
                      <div>
                        <label className="label">Preview</label>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                            style={{ backgroundColor: `${formData.color}20` }}
                          >
                            {formData.icon}
                          </div>
                          <span className="font-medium text-gray-900">{formData.name || 'Category Name'}</span>
                          <span className="text-sm text-gray-500 capitalize">({formData.type})</span>
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
                          type="submit"
                          className="btn-primary"
                        >
                          {editingCategory && editingCategory.id ? 'Update' : 'Add'} Category
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

export default CategoryModal
