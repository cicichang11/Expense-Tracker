# Expense Tracker - Smart Financial Management

A comprehensive, modern expense tracking application built with React, TypeScript, and Tailwind CSS. Track your income and expenses, manage categories, visualize spending patterns, and take control of your finances with an intuitive and beautiful interface. Features AI-powered transaction categorization for intelligent financial management.

## Features

### Core Functionality (MVP)
- **Dashboard**: Overview of financial status with key metrics
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Category Management**: Customizable categories with icons and colors
- **Data Persistence**: Local storage for data persistence across sessions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Advanced Features
- **Data Visualization**: Interactive charts using Recharts
  - Pie chart for expense breakdown by category
  - Line chart for balance trends over time
- **Filtering & Sorting**: Advanced transaction filtering by type, category, date range, and search
- **Financial Reports**: Detailed monthly reports with category breakdowns
- **Real-time Statistics**: Live updates of income, expenses, and balance

### AI-Powered Features
- **Smart Transaction Categorization**: AI automatically suggests categories based on transaction descriptions
- **Quick Transaction Input**: Natural language input like "starbucks, 20 bucks" for fast transaction entry
- **Intelligent Category Suggestions**: Confidence scoring and alternative category recommendations
- **Learning System**: AI improves categorization accuracy based on user feedback
- **Keyword Pattern Recognition**: Advanced pattern matching for 100+ food, transportation, and shopping terms

### Budget Management
- **Monthly/Yearly Budgets**: Set and track budgets per category
- **Budget Utilization**: Visual progress bars and overspending alerts
- **Budget Reports**: Comprehensive budget vs. spending analysis

### Data Export & Reports
- **CSV Export**: Export transactions, budgets, and reports to CSV format
- **PDF Export**: Generate professional PDF reports with charts and summaries
- **Multiple Export Formats**: Choose between CSV and PDF for different use cases

### User Experience
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Responsive Layout**: Mobile-first design with sidebar navigation
- **Interactive Modals**: Smooth forms for adding/editing transactions and categories
- **Visual Feedback**: Color-coded transactions and categories for easy identification
- **Smooth Animations**: CSS transitions and micro-interactions
- **Dark Mode**: Complete theme switching with persistent preferences

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: Zustand for lightweight state management
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for beautiful, consistent icons
- **Date Handling**: date-fns for date manipulation
- **PDF Generation**: jsPDF and html2canvas for report generation
- **AI Categorization**: Custom keyword-based categorization service (easily replaceable with OpenAI/Gemini APIs)
- **Code Quality**: ESLint + Prettier for code formatting

### Backend Architecture Options

#### Option A: Full-Stack with Node.js/Express (Recommended)
- **Frontend**: React (current implementation)
- **Backend**: Node.js + Express + PostgreSQL
- **Authentication**: JWT + bcrypt for secure user management
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **API**: RESTful API with comprehensive CRUD operations
- **Deployment**: Vercel (frontend) + Railway/Heroku (backend)
- **Real-time Features**: WebSocket support for live updates
- **File Storage**: Cloud storage for document uploads and exports

#### Option B: Python FastAPI Backend
- **Frontend**: React (current implementation)
- **Backend**: Python FastAPI + SQLAlchemy + PostgreSQL
- **Authentication**: JWT + passlib for secure user management
- **Database**: PostgreSQL with Alembic migrations
- **API**: FastAPI with automatic OpenAPI documentation
- **Deployment**: Vercel (frontend) + Railway/DigitalOcean (backend)
- **AI Integration**: Native Python ML libraries for enhanced categorization

#### Option C: Supabase Backend
- **Frontend**: React (current implementation)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Authentication**: Built-in Supabase Auth with social providers
- **Database**: PostgreSQL with Row Level Security
- **API**: Auto-generated REST and GraphQL APIs
- **Deployment**: Vercel (frontend) + Supabase Cloud
- **Real-time**: Built-in real-time subscriptions
- **Edge Functions**: Serverless functions for complex business logic

## Installation

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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier

## Usage Guide

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
- Budget utilization overview with progress indicators

#### Transactions
- Add new transactions with type, amount, description, category, and date
- AI-powered category suggestions as you type descriptions
- Quick input mode for natural language transaction entry
- Filter transactions by type, category, date range, or search terms
- Sort transactions by various fields
- Edit or delete existing transactions

#### AI Categorization
- **Smart Suggestions**: Type descriptions like "lunch at starbucks" for automatic "Food & Dining" categorization
- **Confidence Scoring**: See how confident the AI is in its suggestions
- **Alternative Categories**: Get multiple category options when AI is uncertain
- **Feedback System**: Help improve AI accuracy by accepting or rejecting suggestions
- **Natural Language Processing**: Understands context and common transaction patterns

#### Quick Transaction Input
- **Natural Language**: Type "starbucks, 20 bucks" for instant transaction creation
- **Auto-Parsing**: Automatically detects amounts, descriptions, and transaction types
- **AI Integration**: Gets category suggestions for parsed descriptions
- **Preview Mode**: Review parsed transaction before adding

#### Categories
- Create custom income and expense categories
- Choose from 24+ emoji icons
- Select from 15+ predefined colors
- Preview how categories will look before saving

#### Budgets
- Set monthly or yearly budgets per category
- Track spending against budget limits
- Visual progress bars and alerts
- Budget utilization reports

#### Reports
- Monthly financial summaries
- Category-wise spending analysis
- Top spending categories with percentages
- Detailed transaction lists
- Budget vs. actual spending reports

## Project Structure

```
src/
├── components/                    # Reusable UI components
│   ├── Layout.tsx               # Main layout with sidebar
│   ├── Header.tsx               # Top navigation header
│   ├── Sidebar.tsx              # Sidebar navigation
│   ├── StatCard.tsx             # Statistics display cards
│   ├── TransactionList.tsx      # Transaction table
│   ├── TransactionModal.tsx     # Add/edit transaction form
│   ├── CategoryModal.tsx        # Add/edit category form
│   ├── FilterModal.tsx          # Transaction filtering
│   ├── ExpenseChart.tsx         # Pie chart component
│   ├── BalanceChart.tsx         # Line chart component
│   ├── BudgetChart.tsx          # Budget visualization
│   ├── RecentTransactions.tsx   # Recent transactions list
│   ├── MonthlyReport.tsx        # Monthly report component
│   ├── SmartCategorySuggestion.tsx # AI category suggestions
│   ├── QuickTransactionInput.tsx   # Natural language input
│   ├── ExportModal.tsx          # Data export options
│   └── ThemeToggle.tsx          # Dark/light mode toggle
├── pages/                        # Page components
│   ├── Dashboard.tsx            # Main dashboard page
│   ├── Transactions.tsx         # Transactions management
│   ├── Categories.tsx           # Category management
│   ├── Budgets.tsx              # Budget management
│   └── Reports.tsx              # Reports and analytics
├── services/                     # Business logic services
│   └── aiCategorizationService.ts # AI categorization logic
├── store/                       # State management
│   └── useStore.ts             # Zustand store configuration
├── types/                       # TypeScript type definitions
│   └── index.ts                # All type interfaces
├── utils/                       # Utility functions
│   ├── exportUtils.ts          # CSV export utilities
│   └── pdfExportUtils.ts       # PDF export utilities
├── hooks/                       # Custom React hooks
│   └── useTheme.ts             # Theme management hook
├── App.tsx                      # Main app component with routing
├── main.tsx                     # Application entry point
└── index.css                    # Global styles and Tailwind imports
```

## Customization

### Styling
The application uses Tailwind CSS with custom color schemes:
- Primary colors: Blue variants
- Success colors: Green variants  
- Danger colors: Red variants
- Warning colors: Orange variants
- Custom animations and transitions
- Dark mode support with custom color palettes

### Adding New Features
- **New Charts**: Extend the chart components in `src/components/`
- **Additional Reports**: Create new report components in `src/pages/`
- **Custom Categories**: Modify the default categories in `src/store/useStore.ts`
- **AI Integration**: Replace mock AI service with OpenAI/Gemini APIs in `src/services/aiCategorizationService.ts`

## Data Models

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

### Budget
```typescript
interface Budget {
  id: string
  categoryId: string
  amount: number
  period: 'monthly' | 'yearly'
  startDate: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### AI Categorization
```typescript
interface AICategorizationRequest {
  description: string
  type: 'income' | 'expense'
}

interface AICategorizationResponse {
  category: string
  confidence: number
  alternatives?: string[]
}
```

## Data Persistence

- **Local Storage**: All data is stored in the browser's local storage
- **Automatic Saving**: Changes are saved automatically
- **Data Export**: Export functionality available for CSV and PDF formats
- **Backup**: Data persists across browser sessions
- **Theme Persistence**: User preferences for light/dark mode are saved

## AI Categorization System

### Current Implementation
- **Keyword-Based Pattern Matching**: Uses 100+ food, transportation, and shopping keywords
- **Confidence Scoring**: Provides confidence levels from 30% to 98%
- **Smart Fallbacks**: Suggests alternatives when confidence is low
- **Learning Capability**: Collects user feedback for continuous improvement

### Future Enhancements
- **OpenAI Integration**: Replace mock service with GPT-4 for superior accuracy
- **Google Gemini**: Alternative AI service integration
- **Custom ML Models**: Train models on user data for personalized categorization
- **Context Understanding**: Better understanding of complex transaction descriptions

## Backend Development Roadmap

### Phase 1: Database & Authentication
- Set up PostgreSQL database with Prisma ORM
- Implement user registration and login with JWT
- Add user-specific data isolation
- Implement password hashing with bcrypt

### Phase 2: API Development
- Create RESTful API endpoints for all CRUD operations
- Implement middleware for authentication and validation
- Add rate limiting and security headers
- Set up comprehensive error handling

### Phase 3: AI Integration
- Replace mock AI service with OpenAI GPT-4 API
- Implement intelligent prompt engineering
- Add user feedback collection for model improvement
- Set up AI service monitoring and analytics

### Phase 4: Advanced Features
- Real-time updates with WebSocket
- File upload for receipts and documents
- Advanced analytics and machine learning insights
- Multi-currency support and exchange rates

### Phase 5: Deployment & Scaling
- Deploy backend to Railway/Heroku
- Set up CI/CD pipeline with GitHub Actions
- Implement monitoring and logging
- Add performance optimization and caching

## Deployment

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

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Recharts](https://recharts.org/) - Chart library
- [Lucide](https://lucide.dev/) - Icon library
- [date-fns](https://date-fns.org/) - Date utilities
- [jsPDF](https://artskydj.github.io/jsPDF/docs/) - PDF generation
- [html2canvas](https://html2canvas.hertzen.com/) - HTML to canvas conversion

## Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Happy Expense Tracking!**
