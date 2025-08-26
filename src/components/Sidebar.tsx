import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Home, CreditCard, Tag, BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../store/useStore'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const stats = useStore((state) => state.getDashboardStats())

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <h2 className="text-xl font-bold text-gray-900">Expense Tracker</h2>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                  `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                    isActive
                                      ? 'bg-primary-50 text-primary-600'
                                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                                  }`
                                }
                                onClick={() => setOpen(false)}
                              >
                                <item.icon className="h-6 w-5 shrink-0" aria-hidden="true" />
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h2 className="text-xl font-bold text-gray-900">Expense Tracker</h2>
          </div>
          
          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Balance</span>
                  <span className={`text-lg font-semibold ${stats.balance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    ${Math.abs(stats.balance).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className={`text-sm font-medium ${stats.monthlyBalance >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    ${Math.abs(stats.monthlyBalance).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                            isActive
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                          }`
                        }
                      >
                        <item.icon className="h-6 w-5 shrink-0" aria-hidden="true" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar
