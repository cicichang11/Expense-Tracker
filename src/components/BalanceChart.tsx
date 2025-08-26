import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useStore } from '../store/useStore'
import { format, subDays, startOfDay } from 'date-fns'

const BalanceChart = () => {
  const transactions = useStore((state) => state.transactions)

  // Generate last 30 days of data
  const generateBalanceData = () => {
    const data = []
    let runningBalance = 0
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(startOfDay(new Date()), i)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      // Calculate balance for this date
      const dayTransactions = transactions.filter(t => {
        const transactionDate = format(new Date(t.date), 'yyyy-MM-dd')
        return transactionDate <= dateStr
      })
      
      runningBalance = dayTransactions.reduce((balance, t) => {
        return t.type === 'income' ? balance + t.amount : balance - t.amount
      }, 0)
      
      data.push({
        date: format(date, 'MMM dd'),
        balance: Math.round(runningBalance * 100) / 100
      })
    }
    
    return data
  }

  const chartData = generateBalanceData()

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No transaction data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default BalanceChart
