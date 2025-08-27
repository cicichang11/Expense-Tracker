import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import CategoryModal from '../components/CategoryModal'

const Categories = () => {
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  
  const { categories, deleteCategory } = useStore()

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setShowCategoryModal(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will also remove all transactions in this category.')) {
      deleteCategory(id)
    }
  }

  const handleCloseModal = () => {
    setShowCategoryModal(false)
    setEditingCategory(null)
  }

  const handleAddNew = (type: 'income' | 'expense') => {
    setEditingCategory({ type, name: '', color: '#3b82f6', icon: '📊' })
    setShowCategoryModal(true)
  }

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  const CategorySection = ({ title, categories: categoryList, type }: { title: string, categories: any[], type: 'income' | 'expense' }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-heading">{title}</h3>
        <button
          onClick={() => handleAddNew(type)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add {type === 'income' ? 'Income' : 'Expense'} Category
        </button>
      </div>

      {categoryList.length === 0 ? (
        <div className="text-center py-8 text-muted">
          No {type} categories yet. Create your first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryList.map((category) => (
            <div
              key={category.id}
              className="p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-heading">{category.name}</h4>
                    <p className="text-sm text-muted capitalize">{category.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    title="Edit category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-danger-600 hover:text-danger-900 dark:text-danger-400 dark:hover:text-danger-300 p-1 rounded-md hover:bg-danger-50 dark:hover:bg-danger-900/20"
                    title="Delete category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-heading">Categories</h1>
        <p className="mt-2 text-sm text-muted">
          Organize your transactions by creating and managing categories
        </p>
      </div>

      {/* Income Categories */}
      <CategorySection title="Income Categories" categories={incomeCategories} type="income" />

      {/* Expense Categories */}
      <CategorySection title="Expense Categories" categories={expenseCategories} type="expense" />

      {/* Category Modal */}
      <CategoryModal
        open={showCategoryModal}
        onClose={handleCloseModal}
        editingCategory={editingCategory}
      />
    </div>
  )
}

export default Categories
