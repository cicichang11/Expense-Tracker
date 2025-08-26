import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useStore } from '../store/useStore'

const ExpenseChart = () => {
  const transactions = useStore((state) => state.transactions)
  const categories = useStore((state) => state.categories)

  // Get expense transactions only
  const expenseTransactions = transactions.filter(t => t.type === 'expense')
  
  // Group by category and sum amounts
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    const category = transaction.category
    acc[category] = (acc[category] || 0) + transaction.amount
    return acc
  }, {} as Record<string, number>)

  // Convert to chart data format
  const chartData = Object.entries(categoryTotals).map(([name, value]) => {
    const category = categories.find(c => c.name === name)
    return {
      name,
      value: Math.round(value * 100) / 100,
      color: category?.color || '#6b7280'
    }
  })

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No expense data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
          labelFormatter={(label) => `Category: ${label}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default ExpenseChart
