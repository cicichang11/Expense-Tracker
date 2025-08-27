import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import TransactionModal from './TransactionModal'
import { useStore } from '../store/useStore'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isTransactionModalOpen, closeTransactionModal } = useStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="lg:pl-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Global Transaction Modal */}
      <TransactionModal
        open={isTransactionModalOpen}
        onClose={closeTransactionModal}
      />
    </div>
  )
}

export default Layout
