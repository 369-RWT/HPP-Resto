# CostFlow - Food Production Cost Accounting System

Food and beverage production cost accounting application with comprehensive recipe management, cost calculation, and profitability analysis.

## Overview

CostFlow is a web-based application designed for F&B businesses to manage production costs, standardize recipes, track yield, log daily production, and analyze cost variance and menu profitability.

## Technology Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** SQLite with Prisma ORM
- **Validation:** Joi
- **Security:** Helmet, CORS, bcryptjs

### Frontend
- **Framework:** React 18 + Vite
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router v6
- **State:** Zustand
- **HTTP Client:** Axios
- **Charts:** Recharts

## Project Structure

```
HPP-Resto/
├── backend/                    # Express.js API Server
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Migration history
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # Prisma client
│   │   ├── middleware/
│   │   │   ├── auth.js        # Authentication
│   │   │   └── validate.js    # Validation utilities
│   │   ├── routes/            # API routes (10 modules)
│   │   │   ├── auth.routes.js
│   │   │   ├── supplier.routes.js
│   │   │   ├── material.routes.js
│   │   │   ├── menu.routes.js
│   │   │   ├── recipe.routes.js
│   │   │   ├── yield.routes.js
│   │   │   ├── production.routes.js
│   │   │   ├── cost.routes.js
│   │   │   ├── variance.routes.js
│   │   │   └── report.routes.js
│   │   └── server.js          # Express server
│   ├── dev.db                 # SQLite database
│   └── package.json
│
└── frontend/                   # React Application
    ├── src/
    │   ├── components/
    │   │   └── Layout/
    │   │       └── Layout.jsx # Main layout with sidebar
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Settings.jsx
    │   │   └── [9 more pages]
    │   ├── services/
    │   │   └── api.js         # Axios client
    │   ├── store/
    │   │   └── appStore.js    # Zustand store
    │   └── App.jsx            # Main app component
    ├── vite.config.js
    └── package.json
```

## Quick Start

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev

# Server will run on http://localhost:3000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application will run on http://localhost:5173
```

## Features

### ✅ Completed (Version 1.0.0)

#### Sprint 1-2: Foundation & Setup
- ✅ Backend API with 10 route modules
- ✅ SQLite database with Prisma ORM
- ✅ Complete database schema for all business entities
- ✅ Input validation and error handling
- ✅ React frontend with Material-UI
- ✅ Responsive navigation layout
- ✅ Dashboard with statistics
- ✅ Business settings management (labor rate, business info)
- ✅ Apple-inspired UI/UX design system

#### Sprint 3-4: Master Data & Recipe Management
- ✅ **Suppliers Management**: Full CRUD with contact tracking, soft delete
- ✅ **Raw Materials Management**: Material tracking with supplier integration, yield percentages, pricing
- ✅ **Menu Items Management**: Menu item catalog with portions, labor hours, categories
- ✅ **Recipe Management**: Detailed ingredient lists, quantity tracking, cost calculation
- ✅ Reusable DataTable component with search and pagination
- ✅ Reusable ConfirmDialog component
- ✅ Real-time recipe cost calculation with yield adjustments

#### Sprint 5-6: Production Tracking & Cost Analysis
- ✅ **Production Logging**: Daily production tracking with portions produced/sold, labor hours
- ✅ **Yield Testing**: Material yield tests with automatic percentage calculation
- ✅ **Cost Calculation**: Standard cost calculation (material + labor + overhead)
- ✅ **Variance Analysis**: Actual vs standard cost comparison with color-coded indicators
- ✅ Date range filtering
- ✅ Efficiency metrics and tracking
- ✅ Favorable/unfavorable variance visualization

#### Sprint 7: Reports & Analytics
- ✅ **Menu Profitability Report**: Revenue, cost, margin analysis by menu item
- ✅ **Monthly Summary Report**: Total revenue, costs, profit margins by month
- ✅ **Cost Breakdown**: Material, labor, and overhead cost percentages
- ✅ **Interactive Dashboards**: Tabbed reports with date/month filters
- ✅ Color-coded performance indicators
- ✅ Comprehensive business analytics

### Future Enhancements
- CSV import/export functionality
- Advanced charts and data visualization (trend lines)
- Multi-user authentication and role-based access
- Inventory management integration
- Advanced forecasting and predictive analytics

## API Endpoints

### Authentication & Settings
- `GET /api/auth/status` - Check initialization status
- `POST /api/auth/init` - Initialize business
- `GET /api/auth/settings` - Get settings
- `PUT /api/auth/settings` - Update settings

### Master Data
- `/api/suppliers` - Supplier management
- `/api/materials` - Raw material management
- `/api/menu-items` - Menu item management

### Recipe & Production
- `/api/recipes/:menuItemId/details` - Recipe management
- `/api/yield-tests` - Yield testing
- `/api/production-logs` - Production logging

### Cost & Analysis
- `/api/cost-standards/calculate/:menuItemId` - Cost calculation
- `/api/variance-analysis/calculate/:productionLogId` - Variance analysis
- `/api/reports/*` - Various reports

See [backend/README.md](backend/README.md) for complete API documentation.

## Database Schema

The application uses SQLite with the following main entities:
- **BusinessSettings** - Business configuration
- **Supplier** - Supplier information
- **RawMaterial** - Ingredients and materials
- **MenuItem** - Menu/product catalog
- **RecipeDetail** - Recipe ingredients
- **YieldTest** - Yield testing records
- **ProductionLog** - Daily production data
- **CostStandard** - Cost calculations
- **VarianceRecord** - Variance analysis
- **MenuPricing** - Pricing and profitability

## Development

### Backend Commands
```bash
npm run dev              # Start development server
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
```

### Frontend Commands
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
APP_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=CostFlow
```

## Architecture

### Single-User Design
- Simplified for single-business operation
- No multi-user authentication complexity
- Business settings stored as single database record
- API key authentication (optional for production)

### Cost Calculation
- Material costs with yield adjustment
- Labor costs based on hourly rate
- Overhead allocation (multiple methods)
- Cost per portion calculations

### Variance Analysis
- Material price variance
- Labor efficiency variance
- Overhead variance
- Historical trend tracking

## Contributing

This is a proprietary project developed for food and beverage cost accounting.

## License

Proprietary - All rights reserved

---

**Status:** Sprint 1-2 Complete ✅  
**Version:** 1.0.0  
**Last Updated:** December 2025
