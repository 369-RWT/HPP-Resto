# CostFlow Backend

Backend API for CostFlow Food Production Cost Accounting System.

## Technology Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Validation**: Joi
- **Security**: Helmet, CORS, bcryptjs

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (optional)
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `GET /api/auth/status` - Check initialization status
- `POST /api/auth/init` - Initialize application
- `GET /api/auth/settings` - Get business settings
- `PUT /api/auth/settings` - Update business settings

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers/:id` - Get supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Raw Materials
- `GET /api/materials` - List materials
- `POST /api/materials` - Create material
- `GET /api/materials/:id` - Get material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material
- `GET /api/materials/categories/list` - Get categories

### Menu Items
- `GET /api/menu-items` - List menu items
- `POST /api/menu-items` - Create menu item
- `GET /api/menu-items/:id` - Get menu item
- `PUT /api/menu-items/:id` - Update menu item
- `DELETE /api/menu-items/:id` - Delete menu item
- `GET /api/menu-items/categories/list` - Get categories

### Recipes
- `GET /api/recipes/:menuItemId/details` - Get recipe details
- `POST /api/recipes/:menuItemId/details` - Add ingredient
- `PUT /api/recipes/:menuItemId/details/:id` - Update ingredient
- `DELETE /api/recipes/:menuItemId/details/:id` - Remove ingredient
- `POST /api/recipes/:menuItemId/duplicate` - Duplicate recipe

### Yield Tests
- `GET /api/yield-tests` - List yield tests
- `POST /api/yield-tests` - Create yield test
- `GET /api/yield-tests/:id` - Get yield test
- `PUT /api/yield-tests/:id` - Update yield test
- `DELETE /api/yield-tests/:id` - Delete yield test
- `GET /api/yield-tests/material/:materialId/average` - Get average yield

### Production Logs
- `GET /api/production-logs` - List production logs
- `POST /api/production-logs` - Create production log
- `GET /api/production-logs/:id` - Get production log
- `PUT /api/production-logs/:id` - Update production log
- `DELETE /api/production-logs/:id` - Delete production log
- `POST /api/production-logs/:id/details` - Add material usage
- `PUT /api/production-logs/:id/details/:detailId` - Update material usage
- `DELETE /api/production-logs/:id/details/:detailId` - Remove material usage

### Cost Standards
- `POST /api/cost-standards/calculate/:menuItemId` - Calculate cost
- `GET /api/cost-standards/:menuItemId` - Get latest cost standard
- `GET /api/cost-standards/:menuItemId/history` - Get cost history
- `GET /api/cost-standards/overhead/config` - Get overhead config
- `POST /api/cost-standards/overhead/config` - Set overhead config

### Variance Analysis
- `POST /api/variance-analysis/calculate/:productionLogId` - Calculate variance
- `GET /api/variance-analysis/summary` - Get variance summary
- `GET /api/variance-analysis/:menuItemId` - Get menu item variances

### Reports
- `GET /api/reports/menu-profitability` - Menu profitability analysis
- `GET /api/reports/cost-trends` - Cost trends over time
- `GET /api/reports/monthly-summary` - Monthly summary report
- `GET /api/reports/dashboard` - Dashboard statistics

## Database Schema

See `prisma/schema.prisma` for complete schema definition.

## Development

- The API uses JSONvalidation with Joi
- All routes have error handling via async handlers
- SQLite database file is created automatically at `./dev.db`
- Use Prisma Studio to view/edit database: `npm run prisma:studio`

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── config/
│   │   └── database.js     # Prisma client
│   ├── middleware/
│   │   ├── auth.js         # Authentication
│   │   └── validate.js     # Validation utilities
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── supplier.routes.js
│   │   ├── material.routes.js
│   │   ├── menu.routes.js
│   │   ├── recipe.routes.js
│   │   ├── yield.routes.js
│   │   ├── production.routes.js
│   │   ├── cost.routes.js
│   │   ├── variance.routes.js
│   │   └── report.routes.js
│   └── server.js           # Main server file
├── .env                    # Environment variables
├── .env.example           # Environment template
└── package.json
```
