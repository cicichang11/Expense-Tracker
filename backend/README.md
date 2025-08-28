# Expense Tracker Backend API

A robust, scalable backend API for the Expense Tracker application built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Registration, login, profile management, and account deletion
- **Category Management**: CRUD operations for income and expense categories
- **Transaction Management**: Full transaction lifecycle with filtering, pagination, and statistics
- **Budget Management**: Monthly/yearly budgets with utilization tracking
- **AI Categorization**: Smart transaction categorization with feedback collection
- **Data Validation**: Comprehensive input validation using express-validator
- **Security**: Helmet security headers, CORS configuration, and rate limiting ready
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=5000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio for database management

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `GET /api/user/dashboard/stats` - Get dashboard statistics
- `DELETE /api/user/account` - Delete user account

### Categories
- `GET /api/categories` - Get all user categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Transactions
- `GET /api/transactions` - Get transactions with filtering and pagination
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats/summary` - Get transaction statistics

### Budgets
- `GET /api/budgets` - Get all user budgets
- `GET /api/budgets/:id` - Get budget by ID
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/:id/utilization` - Get budget utilization
- `GET /api/budgets/overview/utilization` - Get all budgets with utilization

### AI Categorization
- `POST /api/ai/categorize` - Get AI category suggestion
- `POST /api/ai/feedback` - Submit AI feedback
- `GET /api/ai/feedback/stats` - Get feedback statistics
- `GET /api/ai/feedback/recent` - Get recent feedback

## Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `username`: Username (unique)
- `password`: Hashed password
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Category
- `id`: Unique identifier
- `name`: Category name
- `type`: INCOME or EXPENSE
- `color`: Hex color code
- `icon`: Emoji icon
- `userId`: Foreign key to User
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Transaction
- `id`: Unique identifier
- `amount`: Transaction amount
- `type`: INCOME or EXPENSE
- `description`: Transaction description
- `categoryId`: Foreign key to Category
- `userId`: Foreign key to User
- `date`: Transaction date
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Budget
- `id`: Unique identifier
- `amount`: Budget amount
- `period`: MONTHLY or YEARLY
- `startDate`: Budget start date
- `endDate`: Budget end date (optional)
- `isActive`: Budget status
- `categoryId`: Foreign key to Category
- `userId`: Foreign key to User
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### AI Categorization Feedback
- `id`: Unique identifier
- `originalDescription`: Original transaction description
- `suggestedCategory`: AI-suggested category
- `userSelectedCategory`: User's actual selection
- `isCorrect`: Whether AI was correct
- `userId`: Foreign key to User
- `timestamp`: Feedback timestamp

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **Security Headers**: Helmet for security headers
- **CORS Configuration**: Configurable cross-origin resource sharing
- **User Isolation**: All data is scoped to authenticated users
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## Development

### Project Structure
```
src/
├── index.ts              # Main server file
├── middleware/           # Custom middleware
│   └── auth.ts          # JWT authentication
├── routes/               # API route handlers
│   ├── auth.ts          # Authentication routes
│   ├── user.ts          # User management routes
│   ├── category.ts      # Category CRUD routes
│   ├── transaction.ts   # Transaction CRUD routes
│   ├── budget.ts        # Budget CRUD routes
│   └── ai.ts            # AI categorization routes
└── types/                # TypeScript type definitions
```

### Adding New Features

1. **Create new route file** in `src/routes/`
2. **Add route import** in `src/index.ts`
3. **Define validation** using express-validator
4. **Implement business logic** with Prisma queries
5. **Add error handling** and proper HTTP status codes
6. **Update this README** with new endpoints

### Database Migrations

When changing the database schema:

1. **Update Prisma schema** in `prisma/schema.prisma`
2. **Generate migration**:
   ```bash
   npm run db:migrate
   ```
3. **Apply migration**:
   ```bash
   npm run db:push
   ```

## Deployment

### Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set production environment variables**:
   ```env
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   ```

3. **Start production server**:
   ```bash
   npm start
   ```

### Deployment Options

- **Railway**: Easy deployment with PostgreSQL
- **Heroku**: Traditional hosting with add-ons
- **DigitalOcean**: VPS with managed databases
- **AWS**: EC2 with RDS
- **Vercel**: Serverless functions (with limitations)

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |

## Testing

The API can be tested using:

- **Postman**: Import the API collection
- **Insomnia**: REST client with good UI
- **curl**: Command-line testing
- **Frontend application**: Integration testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Open an issue on GitHub
- Check the API documentation
- Review the code examples
