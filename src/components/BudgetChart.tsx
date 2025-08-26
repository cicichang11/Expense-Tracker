import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../store/useStore'

const BudgetChart = () => {
  const budgetData = useStore((state) => state.getBudgetChartData())

  if (budgetData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No budgets set yet</p>
          <p className="text-sm text-gray-400">Set budgets for your expense categories to start tracking</p>
        </div>
      </div>
    )
  }

  // Prepare data for the chart
  const chartData = budgetData.map(item => ({
    name: item.category,
    spent: item.spent,
    budget: item.budget,
    remaining: item.remaining,
    percentage: item.percentage,
    color: item.color
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Spent: <span className="font-medium text-danger-600">${data.spent.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Budget: <span className="font-medium text-primary-600">${data.budget.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Remaining: <span className={`font-medium ${data.remaining >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              ${data.remaining.toFixed(2)}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Usage: <span className={`font-medium ${data.percentage <= 80 ? 'text-success-600' : data.percentage <= 100 ? 'text-warning-600' : 'text-danger-600'}`}>
              {data.percentage.toFixed(1)}%
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
          <Bar dataKey="spent" fill="#ef4444" name="Spent" />
        </BarChart>
      </ResponsiveContainer>

      {/* Budget Progress Bars */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Budget Progress</h4>
        {budgetData.map((item) => (
          <div key={item.category} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900">{item.category}</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.percentage <= 80 
                    ? 'bg-success-100 text-success-800' 
                    : item.percentage <= 100 
                    ? 'bg-warning-100 text-warning-800' 
                    : 'bg-danger-100 text-danger-800'
                }`}>
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  item.percentage <= 80 
                    ? 'bg-success-500' 
                    : item.percentage <= 100 
                    ? 'bg-warning-500' 
                    : 'bg-danger-500'
                }`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
            {item.remaining < 0 && (
              <p className="text-xs text-danger-600">
                Over budget by ${Math.abs(item.remaining).toFixed(2)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BudgetChart
