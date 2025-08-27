import { useState } from 'react'
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const ThemeToggle = () => {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, color: 'text-yellow-500' },
    { value: 'dark', label: 'Dark', icon: Moon, color: 'text-blue-500' },
    { value: 'system', label: 'System', icon: Monitor, color: 'text-gray-500' }
  ]

  const currentTheme = themeOptions.find(t => t.value === theme)

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'light') setLightTheme()
    else if (newTheme === 'dark') setDarkTheme()
    else setSystemTheme()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        aria-label="Toggle theme"
      >
        {currentTheme && (
          <>
            <currentTheme.icon className={`h-4 w-4 ${currentTheme.color}`} />
            <span className="hidden sm:inline">{currentTheme.label}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-20 py-1">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value as 'light' | 'dark' | 'system')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-dark-bg-secondary transition-colors duration-150 ${
                  theme === option.value 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                <option.icon className={`h-4 w-4 ${option.color}`} />
                <span>{option.label}</span>
                {theme === option.value && (
                  <div className="ml-auto w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeToggle
