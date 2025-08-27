import { Menu, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const openTransactionModal = useStore((state) => state.openTransactionModal)

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-200">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 lg:hidden hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text transition-colors duration-200">Expense Tracker</h1>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => openTransactionModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
