import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'
import { Transaction, Category, Budget, FilterOptions } from '../types'
import { format, startOfMonth, endOfMonth } from 'date-fns'

// PDF Configuration
const PDF_CONFIG = {
  pageSize: 'a4' as const,
  margin: 20,
  titleFontSize: 20,
  subtitleFontSize: 14,
  bodyFontSize: 10,
  headerColor: [59, 130, 246] as [number, number, number], // Primary blue
  successColor: [34, 197, 94] as [number, number, number], // Success green
  dangerColor: [239, 68, 68] as [number, number, number],  // Danger red
  warningColor: [245, 158, 11] as [number, number, number], // Warning orange
}

// Helper function to add title to PDF
const addTitle = (pdf: jsPDF, text: string, y: number = 20): number => {
  pdf.setFontSize(PDF_CONFIG.titleFontSize)
  pdf.setTextColor(PDF_CONFIG.headerColor[0], PDF_CONFIG.headerColor[1], PDF_CONFIG.headerColor[2])
  pdf.text(text, PDF_CONFIG.margin, y)
  return y + 15
}

// Helper function to add subtitle to PDF
const addSubtitle = (pdf: jsPDF, text: string, y: number): number => {
  pdf.setFontSize(PDF_CONFIG.subtitleFontSize)
  pdf.setTextColor(75, 85, 99) // Gray
  pdf.text(text, PDF_CONFIG.margin, y)
  return y + 10
}

// Helper function to add text to PDF
const addText = (pdf: jsPDF, text: string, y: number): number => {
  pdf.setFontSize(PDF_CONFIG.bodyFontSize)
  pdf.setTextColor(31, 41, 55) // Dark gray
  pdf.text(text, PDF_CONFIG.margin, y)
  return y + 8
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Helper function to get month name
const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy')
}

// Export transactions to PDF
export const exportTransactionsToPDF = async (
  transactions: Transaction[],
  filterOptions?: FilterOptions
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  let yPosition = PDF_CONFIG.margin

  // Add title
  yPosition = addTitle(pdf, 'Transaction Report', yPosition)

  // Add subtitle with date range
  const now = new Date()
  const startDate = filterOptions?.dateRange?.start 
    ? new Date(filterOptions.dateRange.start)
    : startOfMonth(now)
  const endDate = filterOptions?.dateRange?.end
    ? new Date(filterOptions.dateRange.end)
    : endOfMonth(now)
  
  yPosition = addSubtitle(pdf, `Period: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`, yPosition)

  // Add summary statistics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpenses

  yPosition = addText(pdf, `Total Income: ${formatCurrency(totalIncome)}`, yPosition)
  yPosition = addText(pdf, `Total Expenses: ${formatCurrency(totalExpenses)}`, yPosition)
  yPosition = addText(pdf, `Net Balance: ${formatCurrency(balance)}`, yPosition)
  yPosition = addText(pdf, `Transaction Count: ${transactions.length}`, yPosition)

  // Add transactions table
  if (transactions.length > 0) {
    yPosition += 10
    
    const tableData = transactions.map(t => [
      format(new Date(t.date), 'MMM dd, yyyy'),
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      t.category,
      t.description || '-',
      formatCurrency(t.amount)
    ])

    autoTable(pdf, {
      head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
      body: tableData,
      startY: yPosition,
      margin: { left: PDF_CONFIG.margin },
      styles: {
        fontSize: PDF_CONFIG.bodyFontSize,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: PDF_CONFIG.headerColor,
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Light gray
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Date
        1: { cellWidth: 20 }, // Type
        2: { cellWidth: 35 }, // Category
        3: { cellWidth: 50 }, // Description
        4: { cellWidth: 25, halign: 'right' }, // Amount
      },
    })
  }

  // Add footer
  const pageCount = pdf.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(156, 163, 175) // Light gray
    pdf.text(
      `Page ${i} of ${pageCount} | Generated on ${format(now, 'MMM dd, yyyy HH:mm')}`,
      PDF_CONFIG.margin,
      pdf.internal.pageSize.height - 10
    )
  }

  // Save the PDF
  const filename = `transaction-report_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}_${format(now, 'yyyy-MM-dd_HH-mm')}.pdf`
  pdf.save(filename)
}

// Export budget report to PDF
export const exportBudgetReportToPDF = async (
  budgets: Budget[],
  categories: Category[],
  transactions: Transaction[],
  startDate: string,
  endDate: string
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  let yPosition = PDF_CONFIG.margin

  // Add title
  yPosition = addTitle(pdf, 'Budget Report', yPosition)

  // Add subtitle
  yPosition = addSubtitle(pdf, `Period: ${format(new Date(startDate), 'MMM dd, yyyy')} - ${format(new Date(endDate), 'MMM dd, yyyy')}`, yPosition)

  // Calculate budget statistics
  const activeBudgets = budgets.filter(b => b.isActive)
  const totalBudget = activeBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = activeBudgets.reduce((sum, b) => {
    const category = categories.find(c => c.id === b.categoryId)
    if (!category) return sum
    
    const spent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === category.name &&
        new Date(t.date) >= new Date(startDate) &&
        new Date(t.date) <= new Date(endDate)
      )
      .reduce((sum, t) => sum + t.amount, 0)
    
    return sum + spent
  }, 0)
  
  const totalRemaining = totalBudget - totalSpent
  const overallUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  // Add summary statistics
  yPosition = addText(pdf, `Total Budget: ${formatCurrency(totalBudget)}`, yPosition)
  yPosition = addText(pdf, `Total Spent: ${formatCurrency(totalSpent)}`, yPosition)
  yPosition = addText(pdf, `Total Remaining: ${formatCurrency(totalRemaining)}`, yPosition)
  yPosition = addText(pdf, `Overall Utilization: ${overallUtilization.toFixed(1)}%`, yPosition)

  // Add budget details table
  if (activeBudgets.length > 0) {
    yPosition += 10
    
    const tableData = activeBudgets.map(budget => {
      const category = categories.find(c => c.id === budget.categoryId)
      const spent = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === category?.name &&
          new Date(t.date) >= new Date(startDate) &&
          new Date(t.date) <= new Date(endDate)
        )
        .reduce((sum, t) => sum + t.amount, 0)
      
      const remaining = budget.amount - spent
      const utilization = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
      const status = remaining >= 0 ? 'Under Budget' : 'Over Budget'
      
      return [
        category?.name || 'Unknown',
        formatCurrency(budget.amount),
        budget.period,
        formatCurrency(spent),
        formatCurrency(remaining),
        `${utilization.toFixed(1)}%`,
        status
      ]
    })

    autoTable(pdf, {
      head: [['Category', 'Budget', 'Period', 'Spent', 'Remaining', 'Utilization', 'Status']],
      body: tableData,
      startY: yPosition,
      margin: { left: PDF_CONFIG.margin },
      styles: {
        fontSize: PDF_CONFIG.bodyFontSize,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: PDF_CONFIG.headerColor,
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 35 }, // Category
        1: { cellWidth: 25, halign: 'right' }, // Budget
        2: { cellWidth: 20 }, // Period
        3: { cellWidth: 25, halign: 'right' }, // Spent
        4: { cellWidth: 25, halign: 'right' }, // Remaining
        5: { cellWidth: 25, halign: 'right' }, // Utilization
        6: { cellWidth: 25 }, // Status
      },
    })
  }

  // Add footer
  const pageCount = pdf.getNumberOfPages()
  const now = new Date()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(156, 163, 175)
    pdf.text(
      `Page ${i} of ${pageCount} | Generated on ${format(now, 'MMM dd, yyyy HH:mm')}`,
      PDF_CONFIG.margin,
      pdf.internal.pageSize.height - 10
    )
  }

  // Save the PDF
  const filename = `budget-report_${format(new Date(startDate), 'yyyy-MM-dd')}_to_${format(new Date(endDate), 'yyyy-MM-dd')}_${format(now, 'yyyy-MM-dd_HH-mm')}.pdf`
  pdf.save(filename)
}

// Export monthly summary to PDF
export const exportMonthlySummaryToPDF = async (
  month: Date,
  transactions: Transaction[],
  categories: Category[]
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  let yPosition = PDF_CONFIG.margin

  // Add title
  yPosition = addTitle(pdf, 'Monthly Financial Summary', yPosition)

  // Add subtitle
  yPosition = addSubtitle(pdf, `Month: ${getMonthName(month)}`, yPosition)

  // Calculate monthly statistics
  const startOfMonthDate = startOfMonth(month)
  const endOfMonthDate = endOfMonth(month)
  
  const monthlyTransactions = transactions.filter(t => {
    const date = new Date(t.date)
    return date >= startOfMonthDate && date <= endOfMonthDate
  })

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const monthlyBalance = monthlyIncome - monthlyExpenses

  // Add monthly summary
  yPosition = addText(pdf, `Monthly Income: ${formatCurrency(monthlyIncome)}`, yPosition)
  yPosition = addText(pdf, `Monthly Expenses: ${formatCurrency(monthlyExpenses)}`, yPosition)
  yPosition = addText(pdf, `Monthly Balance: ${formatCurrency(monthlyBalance)}`, yPosition)
  yPosition = addText(pdf, `Transaction Count: ${monthlyTransactions.length}`, yPosition)

  // Add category breakdown
  if (monthlyExpenses > 0) {
    yPosition += 10
    yPosition = addSubtitle(pdf, 'Expense Breakdown by Category', yPosition)

    const categoryExpenses = categories
      .filter(c => c.type === 'expense')
      .map(category => {
        const spent = monthlyTransactions
          .filter(t => t.type === 'expense' && t.category === category.name)
          .reduce((sum, t) => sum + t.amount, 0)
        
        const percentage = monthlyExpenses > 0 ? (spent / monthlyExpenses) * 100 : 0
        
        return {
          category: category.name,
          spent,
          percentage,
          icon: category.icon
        }
      })
      .filter(item => item.spent > 0)
      .sort((a, b) => b.spent - a.spent)

    const tableData = categoryExpenses.map(item => [
      `${item.icon} ${item.category}`,
      formatCurrency(item.spent),
      `${item.percentage.toFixed(1)}%`
    ])

    autoTable(pdf, {
      head: [['Category', 'Amount', 'Percentage']],
      body: tableData,
      startY: yPosition,
      margin: { left: PDF_CONFIG.margin },
      styles: {
        fontSize: PDF_CONFIG.bodyFontSize,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: PDF_CONFIG.headerColor,
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 70 }, // Category
        1: { cellWidth: 40, halign: 'right' }, // Amount
        2: { cellWidth: 40, halign: 'right' }, // Percentage
      },
    })
  }

  // Add footer
  const pageCount = pdf.getNumberOfPages()
  const now = new Date()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(156, 163, 175)
    pdf.text(
      `Page ${i} of ${pageCount} | Generated on ${format(now, 'MMM dd, yyyy HH:mm')}`,
      PDF_CONFIG.margin,
      pdf.internal.pageSize.height - 10
    )
  }

  // Save the PDF
  const filename = `monthly-summary_${format(month, 'yyyy-MM')}_${format(now, 'yyyy-MM-dd_HH-mm')}.pdf`
  pdf.save(filename)
}

// Export chart to PDF (captures HTML element as image)
export const exportChartToPDF = async (
  chartElement: HTMLElement,
  title: string,
  filename: string
): Promise<void> => {
  try {
    const canvas = await html2canvas(chartElement, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Add title
    addTitle(pdf, title)
    
    // Calculate image dimensions to fit on page
    const imgWidth = pdf.internal.pageSize.width - (PDF_CONFIG.margin * 2)
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Add image
    pdf.addImage(imgData, 'PNG', PDF_CONFIG.margin, 40, imgWidth, imgHeight)
    
    // Add footer
    const now = new Date()
    pdf.setFontSize(8)
    pdf.setTextColor(156, 163, 175)
    pdf.text(
      `Generated on ${format(now, 'MMM dd, yyyy HH:mm')}`,
      PDF_CONFIG.margin,
      pdf.internal.pageSize.height - 10
    )
    
    pdf.save(filename)
  } catch (error) {
    console.error('Failed to export chart to PDF:', error)
    throw new Error('Failed to export chart to PDF')
  }
}
