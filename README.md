# Expense Tracker - Smart Financial Management

A comprehensive, modern expense tracking application built with React, TypeScript, and Tailwind CSS. Track your income and expenses, manage categories, visualize spending patterns, and take control of your finances with an intuitive and beautiful interface.

## ✨ Features

### 🎯 Core Functionality (MVP)
- **Dashboard**: Overview of financial status with key metrics
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Category Management**: Customizable categories with icons and colors
- **Data Persistence**: Local storage for data persistence across sessions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Advanced Features
- **Data Visualization**: Interactive charts using Recharts
  - Pie chart for expense breakdown by category
  - Line chart for balance trends over time
- **Filtering & Sorting**: Advanced transaction filtering by type, category, date range, and search
- **Financial Reports**: Detailed monthly reports with category breakdowns
- **Real-time Statistics**: Live updates of income, expenses, and balance

### 🎨 User Experience
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Responsive Layout**: Mobile-first design with sidebar navigation
- **Interactive Modals**: Smooth forms for adding/editing transactions and categories
- **Visual Feedback**: Color-coded transactions and categories for easy identification
- **Smooth Animations**: CSS transitions and micro-interactions

## 🚀 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: Zustand for lightweight state management
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for beautiful, consistent icons
- **Date Handling**: date-fns for date manipulation
- **Code Quality**: ESLint + Prettier for code formatting

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ExpenseTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier

## 📱 Usage Guide

### Getting Started
1. **Add Categories**: Start by creating income and expense categories
2. **Record Transactions**: Add your first income or expense transaction
3. **Explore Dashboard**: View your financial overview and trends
4. **Generate Reports**: Analyze your spending patterns monthly

### Key Features

#### Dashboard
- View total balance, monthly income/expenses
- See recent transactions at a glance
- Interactive charts for expense breakdown and balance trends

#### Transactions
- Add new transactions with type, amount, description, category, and date
- Filter transactions by type, category, date range, or search terms
- Sort transactions by various fields
- Edit or delete existing transactions

#### Categories
- Create custom income and expense categories
- Choose from 24+ emoji icons
- Select from 15+ predefined colors
- Preview how categories will look before saving

#### Reports
- Monthly financial summaries
- Category-wise spending analysis
- Top spending categories with percentages
- Detailed transaction lists

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── Header.tsx      # Top navigation header
│   ├── Sidebar.tsx     # Sidebar navigation
│   ├── StatCard.tsx    # Statistics display cards
│   ├── TransactionList.tsx # Transaction table
│   ├── TransactionModal.tsx # Add/edit transaction form
│   ├── CategoryModal.tsx   # Add/edit category form
│   ├── FilterModal.tsx     # Transaction filtering
│   ├── ExpenseChart.tsx    # Pie chart component
│   ├── BalanceChart.tsx    # Line chart component
│   ├── RecentTransactions.tsx # Recent transactions list
│   └── MonthlyReport.tsx   # Monthly report component
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard page
│   ├── Transactions.tsx # Transactions management
│   ├── Categories.tsx   # Category management
│   └── Reports.tsx      # Reports and analytics
├── store/               # State management
│   └── useStore.ts      # Zustand store configuration
├── types/               # TypeScript type definitions
│   └── index.ts         # All type interfaces
├── App.tsx              # Main app component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom color schemes:
- Primary colors: Blue variants
- Success colors: Green variants  
- Danger colors: Red variants
- Custom animations and transitions

### Adding New Features
- **New Charts**: Extend the chart components in `src/components/`
- **Additional Reports**: Create new report components in `src/pages/`
- **Custom Categories**: Modify the default categories in `src/store/useStore.ts`

## 📊 Data Models

### Transaction
```typescript
interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  description?: string
  category: string
  date: string
  createdAt: string
  updatedAt: string
}
```

### Category
```typescript
interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
  createdAt: string
}
```

## 🔒 Data Persistence

- **Local Storage**: All data is stored in the browser's local storage
- **Automatic Saving**: Changes are saved automatically
- **Data Export**: Export functionality available in reports (coming soon)
- **Backup**: Data persists across browser sessions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Configure build settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Recharts](https://recharts.org/) - Chart library
- [Lucide](https://lucide.dev/) - Icon library
- [date-fns](https://date-fns.org/) - Date utilities

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Happy Expense Tracking! 💰📊**
