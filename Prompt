# META-FRAMEWORK: PENGEMBANGAN WEB APP AKUNTANSI BIAYA PRODUKSI
## Sistem Terintegrasi untuk F&B Indonesia dengan Standar Manufaktur

---

## BAGIAN 1: OVERVIEW & VISI

### 1.1 Visi Produk

**Nama Aplikasi:** CostFlow - Food Production Cost Accounting System

**Visi Utama:**
Membangun platform web-based yang mengotomatisasi dan mengintegrasikan seluruh proses akuntansi biaya produksi makanan dan minuman, dari standardisasi resep hingga analisis profitabilitas menu, dengan interface yang user-friendly untuk UMKM hingga skala menengah di Indonesia.

**Misi:**
- Memberikan akses mudah ke data biaya produksi yang akurat dan real-time
- Mengotomatisasi perhitungan biaya yang kompleks
- Menyediakan insights untuk decision-making berbasis data
- Meningkatkan efisiensi operasional dan profitabilitas bisnis F&B

### 1.2 Target Users

1. **Primary Users:**
   - Pemilik/Manajer restoran, kafe, bakery, catering
   - Finance/Accounting staff
   - Production/Kitchen manager

2. **Secondary Users:**
   - Supplier management
   - Quality assurance staff
   - Executive/Owner (untuk reporting)

### 1.3 Key Features (MVP)

**Phase 1 - MVP (Minimum Viable Product):**
1. Master Data Management (Bahan Baku, Menu, Supplier)
2. Recipe Costing & Standardization
3. Yield Testing & Tracking
4. Daily Production Logging
5. Cost Calculation & Reporting
6. Basic Variance Analysis
7. Menu Profitability Analysis
8. User Management & Access Control

**Phase 2 - Enhancement:**
1. Inventory Integration
2. Advanced Variance Analysis
3. Forecasting & Budgeting
4. Multi-location Support
5. Mobile App
6. API Integration (POS, Accounting Software)
7. Dashboard & KPI Monitoring
8. Export & Integration Features

---

## BAGIAN 2: TECHNICAL ARCHITECTURE

### 2.1 Technology Stack

**Frontend:**
- Framework: React.js (modern, component-based, large ecosystem)
- State Management: Redux atau Zustand
- UI Library: Material-UI (MUI) atau Ant Design
- Charts: Chart.js atau Recharts
- Forms: React Hook Form + Yup validation
- Styling: Tailwind CSS
- Build Tool: Vite (faster than Create React App)

**Backend:**
- Runtime: Node.js
- Framework: Express.js atau NestJS
- Database: PostgreSQL (relational, robust, good for financial data)
- ORM: Prisma atau TypeORM
- Authentication: JWT + bcrypt
- API: RESTful API (atau GraphQL untuk phase 2)
- Validation: Joi atau Zod

**Infrastructure:**
- Hosting: AWS, Digital Ocean, atau Heroku (untuk MVP)
- Database Hosting: AWS RDS atau managed PostgreSQL
- File Storage: AWS S3 atau local storage
- Deployment: Docker + CI/CD (GitHub Actions)
- Monitoring: Sentry untuk error tracking

**Development Tools:**
- Version Control: Git + GitHub
- Code Quality: ESLint, Prettier
- Testing: Jest, React Testing Library
- Documentation: Swagger/OpenAPI

### 2.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Frontend)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React App  │  │   Dashboard  │  │   Reports    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                │                    │              │
│         └────────────────┼────────────────────┘              │
│                          │                                    │
│                   HTTP/HTTPS (REST API)                      │
│                          │                                    │
├─────────────────────────┼──────────────────────────────────┤
│                 API GATEWAY & MIDDLEWARE                     │
│         (Authentication, Validation, Error Handling)         │
├─────────────────────────┼──────────────────────────────────┤
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js / NestJS Server               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │  Auth       │  │  Recipe     │  │  Production │  │  │
│  │  │  Controller │  │  Controller │  │  Controller │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │  Cost       │  │  Variance   │  │  Report     │  │  │
│  │  │  Controller │  │  Controller │  │  Controller │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                    │
│                   Business Logic Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services (CostCalculation, VarianceAnalysis, etc)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                    │
├─────────────────────────┼──────────────────────────────────┤
│                    DATA ACCESS LAYER                         │
│         (Prisma ORM / Database Queries)                      │
├─────────────────────────┼──────────────────────────────────┤
│                    DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           PostgreSQL Database                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │  │ Users    │ │ Recipes  │ │ Materials│             │  │
│  │  └──────────┘ └──────────┘ └──────────┘             │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │  │Production│ │ Costs    │ │ Variance │             │  │
│  │  └──────────┘ └──────────┘ └──────────┘             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Database Schema (Core Tables)

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role ENUM('admin', 'manager', 'staff', 'viewer'),
  business_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Business/Company
CREATE TABLE businesses (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'IDR',
  fiscal_year_start INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Raw Materials/Ingredients
CREATE TABLE raw_materials (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL,
  code VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  current_price DECIMAL(15,2),
  yield_percentage DECIMAL(5,2) DEFAULT 100,
  supplier_id UUID,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  payment_terms VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL,
  code VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  standard_portion INT NOT NULL,
  standard_portion_unit VARCHAR(50),
  standard_labor_hours DECIMAL(10,4),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

-- Recipe Details
CREATE TABLE recipe_details (
  id UUID PRIMARY KEY,
  menu_item_id UUID NOT NULL,
  raw_material_id UUID NOT NULL,
  quantity DECIMAL(15,4) NOT NULL,
  unit VARCHAR(50),
  sequence INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id)
);

-- Yield Testing Records
CREATE TABLE yield_tests (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL,
  raw_material_id UUID NOT NULL,
  test_date DATE NOT NULL,
  ap_weight DECIMAL(15,4) NOT NULL,
  ep_weight DECIMAL(15,4) NOT NULL,
  yield_percentage DECIMAL(5,2),
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Daily Production Log
CREATE TABLE production_logs (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL,
  menu_item_id UUID NOT NULL,
  production_date DATE NOT NULL,
  portions_produced INT NOT NULL,
  portions_sold INT,
  labor_hours_actual DECIMAL(10,4),
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Production Log Details (Material Usage)
CREATE TABLE production_log_details (
  id UUID PRIMARY KEY,
  production_log_id UUID NOT NULL,
  raw_material_id UUID NOT NULL,
  quantity_used DECIMAL(15,4) NOT NULL,
  unit VARCHAR(50),
  unit_price DECIMAL(15,2),
  subtotal DECIMAL(15,2),
  FOREIGN KEY (production_log_id) REFERENCES production_logs(id),
  FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id)
);

-- Cost Standards (Calculated)
CREATE TABLE cost_standards (
  id UUID PRIMARY KEY,
  menu_item_id UUID NOT NULL,
  effective_date DATE NOT NULL,
  material_cost DECIMAL(15,2),
  labor_cost DECIMAL(15,2),
  overhead_cost DECIMAL(15,2),
  total_cost DECIMAL(15,2),
  cost_per_portion DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Overhead Configuration
CREATE TABLE overhead_config (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL,
  allocation_method ENUM('percentage_labor', 'percentage_material', 'per_unit'),
  allocation_rate DECIMAL(10,4),
  effective_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

-- Variance Records
CREATE TABLE variance_records (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL,
  menu_item_id UUID NOT NULL,
  production_log_id UUID,
  variance_date DATE NOT NULL,
  standard_cost DECIMAL(15,2),
  actual_cost DECIMAL(15,2),
  variance_amount DECIMAL(15,2),
  variance_percentage DECIMAL(10,2),
  variance_type ENUM('material_price', 'material_usage', 'labor_efficiency', 'overhead'),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (business_id) REFERENCES businesses(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  FOREIGN KEY (production_log_id) REFERENCES production_logs(id)
);

-- Menu Pricing
CREATE TABLE menu_pricing (
  id UUID PRIMARY KEY,
  menu_item_id UUID NOT NULL,
  effective_date DATE NOT NULL,
  selling_price DECIMAL(15,2) NOT NULL,
  cost_per_portion DECIMAL(15,2),
  margin_amount DECIMAL(15,2),
  margin_percentage DECIMAL(10,2),
  food_cost_percentage DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

---

## BAGIAN 3: DEVELOPMENT PHASES & ROADMAP

### 3.1 Phase 1: MVP Development (Months 1-3)

#### Sprint 1-2: Project Setup & Infrastructure (Weeks 1-4)

**Deliverables:**
- [ ] Project repository setup (GitHub)
- [ ] Development environment configuration
- [ ] Database schema created and tested
- [ ] Docker configuration for local development
- [ ] CI/CD pipeline setup (GitHub Actions)
- [ ] API documentation template (Swagger)

**Tasks:**
```
1. Initialize React + Vite frontend project
   - Setup folder structure
   - Configure ESLint, Prettier
   - Setup Tailwind CSS
   
2. Initialize Node.js + Express backend
   - Setup folder structure
   - Configure environment variables
   - Setup database connection
   - Configure middleware (CORS, logging, error handling)
   
3. Create PostgreSQL database
   - Create all tables as per schema
   - Create indexes for performance
   - Setup migrations (Prisma or TypeORM)
   
4. Setup authentication system
   - JWT token implementation
   - Password hashing (bcrypt)
   - User registration & login endpoints
   - Role-based access control (RBAC)
```

**Technology Setup:**
```bash
# Frontend
npx create-vite@latest costflow-frontend --template react
cd costflow-frontend
npm install react-router-dom axios redux react-redux
npm install @mui/material @emotion/react @emotion/styled
npm install recharts chart.js react-chartjs-2
npm install react-hook-form yup
npm install tailwindcss postcss autoprefixer

# Backend
mkdir costflow-backend
cd costflow-backend
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken
npm install prisma @prisma/client
npm install joi
npm install nodemon --save-dev
```

#### Sprint 3-4: Authentication & User Management (Weeks 5-8)

**Deliverables:**
- [ ] User registration & login functionality
- [ ] Role-based access control (Admin, Manager, Staff, Viewer)
- [ ] User profile management
- [ ] Business/Company setup wizard
- [ ] Password reset functionality

**Frontend Components:**
```
/src
├── pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   └── BusinessSetup.jsx
├── components
│   ├── Auth
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   └── Common
│       ├── Navbar.jsx
│       ├── Sidebar.jsx
│       └── Layout.jsx
└── services
    └── authService.js
```

**Backend Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users (admin only)
PUT    /api/users/:id (admin only)
DELETE /api/users/:id (admin only)

POST   /api/businesses
GET    /api/businesses/:id
PUT    /api/businesses/:id
```

#### Sprint 5-6: Master Data Management (Weeks 9-12)

**Deliverables:**
- [ ] Raw materials CRUD (Create, Read, Update, Delete)
- [ ] Suppliers management
- [ ] Menu items management
- [ ] Bulk import functionality (CSV)
- [ ] Data validation & error handling

**Frontend Components:**
```
/src/pages
├── MasterData
│   ├── RawMaterials.jsx
│   ├── RawMaterialForm.jsx
│   ├── Suppliers.jsx
│   ├── SupplierForm.jsx
│   ├── MenuItems.jsx
│   └── MenuItemForm.jsx
└── components
    ├── DataTable.jsx
    ├── ImportCSV.jsx
    └── FormModal.jsx
```

**Backend Endpoints:**
```
GET    /api/raw-materials
POST   /api/raw-materials
GET    /api/raw-materials/:id
PUT    /api/raw-materials/:id
DELETE /api/raw-materials/:id
POST   /api/raw-materials/import (CSV)

GET    /api/suppliers
POST   /api/suppliers
GET    /api/suppliers/:id
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id

GET    /api/menu-items
POST   /api/menu-items
GET    /api/menu-items/:id
PUT    /api/menu-items/:id
DELETE /api/menu-items/:id
```

#### Sprint 7-8: Recipe Management & Costing (Weeks 13-16)

**Deliverables:**
- [ ] Recipe standardization module
- [ ] Recipe detail management (ingredients per recipe)
- [ ] Yield testing module
- [ ] Cost calculation engine
- [ ] Cost standard generation

**Frontend Components:**
```
/src/pages
├── Recipe
│   ├── RecipeList.jsx
│   ├── RecipeForm.jsx
│   ├── RecipeDetails.jsx
│   ├── YieldTesting.jsx
│   └── CostCalculation.jsx
└── components
    ├── RecipeIngredients.jsx
    ├── YieldTestForm.jsx
    └── CostBreakdown.jsx
```

**Backend Endpoints:**
```
GET    /api/recipes
POST   /api/recipes
GET    /api/recipes/:id
PUT    /api/recipes/:id
DELETE /api/recipes/:id

GET    /api/recipes/:id/details
POST   /api/recipes/:id/details
PUT    /api/recipes/:id/details/:detailId
DELETE /api/recipes/:id/details/:detailId

POST   /api/yield-tests
GET    /api/yield-tests
GET    /api/yield-tests/material/:materialId

POST   /api/cost-standards/calculate
GET    /api/cost-standards/:menuItemId
```

**Cost Calculation Algorithm:**
```javascript
function calculateMenuCost(menuItemId, priceDate) {
  // 1. Get recipe details
  const recipeDetails = getRecipeDetails(menuItemId);
  
  // 2. Calculate material cost
  let materialCost = 0;
  for (const detail of recipeDetails) {
    const material = getMaterial(detail.materialId);
    const yieldPercentage = getLatestYield(material.id) || 100;
    const epCost = material.price / (yieldPercentage / 100);
    materialCost += detail.quantity * epCost;
  }
  
  // 3. Get labor cost
  const laborHours = menuItem.standardLaborHours;
  const laborRate = getCompanyLaborRate();
  const laborCost = laborHours * laborRate;
  
  // 4. Calculate overhead
  const overheadConfig = getOverheadConfig();
  let overheadCost = 0;
  
  if (overheadConfig.method === 'percentage_labor') {
    overheadCost = laborCost * (overheadConfig.rate / 100);
  } else if (overheadConfig.method === 'percentage_material') {
    overheadCost = materialCost * (overheadConfig.rate / 100);
  }
  
  // 5. Calculate total
  const totalCost = materialCost + laborCost + overheadCost;
  const costPerPortion = totalCost / menuItem.standardPortion;
  
  return {
    materialCost,
    laborCost,
    overheadCost,
    totalCost,
    costPerPortion
  };
}
```

#### Sprint 9-10: Daily Production Logging (Weeks 17-20)

**Deliverables:**
- [ ] Daily production log entry form
- [ ] Production log listing & filtering
- [ ] Material usage tracking
- [ ] Labor hours tracking
- [ ] Production data validation

**Frontend Components:**
```
/src/pages
├── Production
│   ├── ProductionLog.jsx
│   ├── ProductionLogForm.jsx
│   ├── ProductionLogDetail.jsx
│   └── DailyReport.jsx
└── components
    ├── ProductionForm.jsx
    ├── MaterialUsageTable.jsx
    └── LaborTracking.jsx
```

**Backend Endpoints:**
```
GET    /api/production-logs
POST   /api/production-logs
GET    /api/production-logs/:id
PUT    /api/production-logs/:id
DELETE /api/production-logs/:id

GET    /api/production-logs/:id/details
POST   /api/production-logs/:id/details
PUT    /api/production-logs/:id/details/:detailId
DELETE /api/production-logs/:id/details/:detailId

GET    /api/production-logs/date/:date
GET    /api/production-logs/menu/:menuItemId/date-range
```

#### Sprint 11-12: Variance Analysis & Reporting (Weeks 21-24)

**Deliverables:**
- [ ] Variance calculation engine
- [ ] Variance tracking & recording
- [ ] Variance analysis dashboard
- [ ] Monthly variance report
- [ ] Export functionality (PDF, Excel)

**Frontend Components:**
```
/src/pages
├── Analysis
│   ├── VarianceAnalysis.jsx
│   ├── VarianceDetail.jsx
│   ├── MenuProfitability.jsx
│   ├── CostTrends.jsx
│   └── Reports.jsx
└── components
    ├── VarianceChart.jsx
    ├── ProfitabilityMatrix.jsx
    ├── TrendChart.jsx
    └── ReportGenerator.jsx
```

**Backend Endpoints:**
```
GET    /api/variance-analysis/date-range
POST   /api/variance-analysis/calculate
GET    /api/variance-analysis/:menuItemId
GET    /api/variance-analysis/summary
GET    /api/reports/monthly
GET    /api/reports/menu-profitability
GET    /api/reports/cost-trends
POST   /api/reports/export
```

**Variance Calculation Algorithm:**
```javascript
function calculateVariance(productionLogId) {
  const productionLog = getProductionLog(productionLogId);
  const menuItem = getMenuItem(productionLog.menuItemId);
  const costStandard = getCostStandard(menuItem.id);
  
  // Calculate actual cost from production log details
  let actualMaterialCost = 0;
  for (const detail of productionLog.details) {
    actualMaterialCost += detail.subtotal;
  }
  
  const actualLaborCost = productionLog.laborHoursActual * getLaborRate();
  const actualOverheadCost = calculateActualOverhead(actualLaborCost);
  const actualTotalCost = actualMaterialCost + actualLaborCost + actualOverheadCost;
  
  // Calculate variances
  const materialPriceVariance = actualMaterialCost - (costStandard.materialCost * productionLog.portionsProduced);
  const laborEfficiencyVariance = actualLaborCost - (costStandard.laborCost * productionLog.portionsProduced);
  const overheadVariance = actualOverheadCost - (costStandard.overheadCost * productionLog.portionsProduced);
  
  const totalVariance = materialPriceVariance + laborEfficiencyVariance + overheadVariance;
  const variancePercentage = (totalVariance / (costStandard.totalCost * productionLog.portionsProduced)) * 100;
  
  return {
    materialPriceVariance,
    laborEfficiencyVariance,
    overheadVariance,
    totalVariance,
    variancePercentage
  };
}
```

### 3.2 Phase 2: Enhancement & Scaling (Months 4-6)

**Features to Add:**
- [ ] Inventory integration
- [ ] Advanced variance analysis with drill-down
- [ ] Forecasting & budgeting module
- [ ] Multi-location support
- [ ] Mobile app (React Native)
- [ ] API integrations (POS systems, accounting software)
- [ ] Advanced dashboard with KPI monitoring
- [ ] Automated alerts & notifications
- [ ] Historical data analysis
- [ ] User activity logging & audit trail

---

## BAGIAN 4: STEP-BY-STEP IMPLEMENTATION GUIDE

### 4.1 Local Development Setup

**Prerequisites:**
- Node.js 16+ installed
- PostgreSQL 12+ installed
- Git installed
- Code editor (VS Code recommended)

**Step 1: Clone & Setup Frontend**
```bash
# Clone repository
git clone <repo-url>
cd costflow-frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=CostFlow
EOF

# Start development server
npm run dev
# App will be available at http://localhost:5173
```

**Step 2: Setup Backend**
```bash
cd costflow-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/costflow_db
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
EOF

# Setup database
npx prisma migrate dev --name init

# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
# API will be available at http://localhost:3000/api
```

**Step 3: Setup Database**
```bash
# Create database
createdb costflow_db

# Run migrations
npx prisma migrate dev

# View database
npx prisma studio
```

### 4.2 Feature Implementation Checklist

**Authentication Module:**
- [ ] User registration with email validation
- [ ] Login with JWT token
- [ ] Password hashing with bcrypt
- [ ] Token refresh mechanism
- [ ] Logout functionality
- [ ] Role-based access control
- [ ] Protected routes/endpoints

**Master Data Module:**
- [ ] Raw materials CRUD
- [ ] Suppliers CRUD
- [ ] Menu items CRUD
- [ ] CSV import for bulk data
- [ ] Data validation
- [ ] Search & filtering
- [ ] Pagination

**Recipe Module:**
- [ ] Recipe creation & editing
- [ ] Recipe ingredient management
- [ ] Yield testing form & tracking
- [ ] Cost calculation
- [ ] Recipe versioning (optional)
- [ ] Recipe templates (optional)

**Production Module:**
- [ ] Daily production log entry
- [ ] Material usage tracking
- [ ] Labor hours tracking
- [ ] Production data validation
- [ ] Batch operations
- [ ] Production history

**Analysis Module:**
- [ ] Variance calculation
- [ ] Variance tracking
- [ ] Menu profitability analysis
- [ ] Cost trend analysis
- [ ] KPI dashboard
- [ ] Report generation (PDF, Excel)

### 4.3 Testing Strategy

**Unit Tests:**
```javascript
// Example: Cost calculation test
describe('Cost Calculation Service', () => {
  test('should calculate material cost correctly', () => {
    const recipe = {
      ingredients: [
        { materialId: '1', quantity: 0.1, unit: 'kg' }
      ]
    };
    const materials = {
      '1': { price: 15000, yield: 90 }
    };
    
    const cost = calculateMaterialCost(recipe, materials);
    expect(cost).toBe(1667); // 0.1 * (15000 / 0.9)
  });
});
```

**Integration Tests:**
- Test API endpoints with database
- Test authentication flow
- Test cost calculation with real data

**E2E Tests (Cypress/Playwright):**
- Test complete user workflows
- Test data entry and validation
- Test report generation

### 4.4 Deployment Guide

**Deployment to Production:**

**Option 1: AWS Deployment**
```bash
# Create EC2 instance
# Install Node.js, PostgreSQL, Nginx

# Clone repository
git clone <repo-url>

# Setup environment
cp .env.example .env
# Edit .env with production values

# Install dependencies & build
npm install
npm run build

# Setup PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js

# Setup Nginx as reverse proxy
# Configure SSL with Let's Encrypt
```

**Option 2: Docker Deployment**
```dockerfile
# Dockerfile for backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t costflow-backend .
docker run -d \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  -p 3000:3000 \
  costflow-backend
```

**Option 3: Heroku Deployment**
```bash
# Create Heroku app
heroku create costflow-app

# Set environment variables
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## BAGIAN 5: FRONTEND COMPONENT STRUCTURE

### 5.1 Main Pages Layout

```
/src
├── pages
│   ├── Dashboard.jsx          # Main dashboard with KPI
│   ├── Auth
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── MasterData
│   │   ├── RawMaterials.jsx
│   │   ├── Suppliers.jsx
│   │   └── MenuItems.jsx
│   ├── Recipe
│   │   ├── RecipeList.jsx
│   │   ├── RecipeForm.jsx
│   │   ├── YieldTesting.jsx
│   │   └── CostCalculation.jsx
│   ├── Production
│   │   ├── ProductionLog.jsx
│   │   ├── ProductionLogForm.jsx
│   │   └── DailyReport.jsx
│   ├── Analysis
│   │   ├── VarianceAnalysis.jsx
│   │   ├── MenuProfitability.jsx
│   │   ├── CostTrends.jsx
│   │   └── Reports.jsx
│   └── Settings
│       ├── UserManagement.jsx
│       ├── BusinessSettings.jsx
│       └── OverheadConfiguration.jsx
├── components
│   ├── Common
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Layout.jsx
│   │   └── LoadingSpinner.jsx
│   ├── Forms
│   │   ├── FormInput.jsx
│   │   ├── FormSelect.jsx
│   │   ├── FormDatePicker.jsx
│   │   └── FormValidator.jsx
│   ├── Tables
│   │   ├── DataTable.jsx
│   │   ├── TablePagination.jsx
│   │   └── TableFilter.jsx
│   ├── Charts
│   │   ├── VarianceChart.jsx
│   │   ├── TrendChart.jsx
│   │   ├── ProfitabilityChart.jsx
│   │   └── KPICard.jsx
│   └── Modals
│       ├── ConfirmDialog.jsx
│       ├── FormModal.jsx
│       └── ExportModal.jsx
├── services
│   ├── api.js                 # Axios instance
│   ├── authService.js
│   ├── materialService.js
│   ├── recipeService.js
│   ├── productionService.js
│   ├── costService.js
│   └── reportService.js
├── store
│   ├── authSlice.js           # Redux slices
│   ├── materialSlice.js
│   ├── recipeSlice.js
│   ├── productionSlice.js
│   └── store.js
├── hooks
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useForm.js
├── utils
│   ├── formatters.js          # Currency, date formatting
│   ├── validators.js
│   ├── calculations.js
│   └── constants.js
└── App.jsx
```

### 5.2 Example Component: Recipe Form

```jsx
// src/pages/Recipe/RecipeForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { recipeService } from '../../services/recipeService';
import FormInput from '../../components/Forms/FormInput';
import FormSelect from '../../components/Forms/FormSelect';

// Validation schema
const recipeSchema = yup.object({
  name: yup.string().required('Menu name is required'),
  category: yup.string().required('Category is required'),
  standardPortion: yup.number().required('Standard portion is required'),
  standardLaborHours: yup.number().required('Labor hours is required'),
  ingredients: yup.array().of(
    yup.object({
      materialId: yup.string().required('Material is required'),
      quantity: yup.number().required('Quantity is required'),
      unit: yup.string().required('Unit is required')
    })
  )
});

export default function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(recipeSchema),
    defaultValues: {
      ingredients: [{ materialId: '', quantity: 0, unit: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  });

  useEffect(() => {
    loadMaterials();
    if (id) loadRecipe(id);
  }, [id]);

  const loadMaterials = async () => {
    try {
      const data = await recipeService.getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error('Failed to load materials:', error);
    }
  };

  const loadRecipe = async (recipeId) => {
    try {
      const recipe = await recipeService.getRecipe(recipeId);
      // Populate form with recipe data
    } catch (error) {
      console.error('Failed to load recipe:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (id) {
        await recipeService.updateRecipe(id, data);
      } else {
        await recipeService.createRecipe(data);
      }
      navigate('/recipes');
    } catch (error) {
      console.error('Failed to save recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Edit Recipe' : 'Create Recipe'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Menu Name"
            {...register('name')}
            error={errors.name?.message}
          />
          <FormSelect
            label="Category"
            {...register('category')}
            options={[
              { value: 'beverage', label: 'Beverage' },
              { value: 'food', label: 'Food' }
            ]}
            error={errors.category?.message}
          />
          <FormInput
            label="Standard Portion"
            type="number"
            {...register('standardPortion')}
            error={errors.standardPortion?.message}
          />
          <FormInput
            label="Labor Hours"
            type="number"
            step="0.25"
            {...register('standardLaborHours')}
            error={errors.standardLaborHours?.message}
          />
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-4 gap-4 mb-4">
              <FormSelect
                label="Material"
                {...register(`ingredients.${index}.materialId`)}
                options={materials.map(m => ({ value: m.id, label: m.name }))}
              />
              <FormInput
                label="Quantity"
                type="number"
                step="0.01"
                {...register(`ingredients.${index}.quantity`)}
              />
              <FormInput
                label="Unit"
                {...register(`ingredients.${index}.unit`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-8 bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ materialId: '', quantity: 0, unit: '' })}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Ingredient
          </button>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## BAGIAN 6: BACKEND API ENDPOINTS REFERENCE

### 6.1 Authentication Endpoints

```
POST   /api/auth/register
Body: { email, password, fullName, businessName }
Response: { id, email, token }

POST   /api/auth/login
Body: { email, password }
Response: { id, email, token, role }

POST   /api/auth/refresh-token
Headers: { Authorization: Bearer <token> }
Response: { token }

POST   /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { message: "Logged out successfully" }
```

### 6.2 Master Data Endpoints

```
GET    /api/raw-materials
Query: { page, limit, search, category }
Response: { data: [...], total, page, limit }

POST   /api/raw-materials
Body: { code, name, unit, category, currentPrice, yieldPercentage, supplierId }
Response: { id, code, name, ... }

GET    /api/raw-materials/:id
Response: { id, code, name, ... }

PUT    /api/raw-materials/:id
Body: { code, name, unit, category, currentPrice, yieldPercentage, supplierId }
Response: { id, code, name, ... }

DELETE /api/raw-materials/:id
Response: { message: "Material deleted successfully" }

POST   /api/raw-materials/import
Body: FormData with CSV file
Response: { imported: 50, failed: 2, errors: [...] }
```

### 6.3 Recipe Endpoints

```
GET    /api/recipes
Query: { page, limit, search, category }
Response: { data: [...], total, page, limit }

POST   /api/recipes
Body: { name, category, standardPortion, standardPortionUnit, standardLaborHours }
Response: { id, name, ... }

GET    /api/recipes/:id
Response: { id, name, details: [...], costStandard: {...} }

PUT    /api/recipes/:id
Body: { name, category, standardPortion, standardPortionUnit, standardLaborHours }
Response: { id, name, ... }

DELETE /api/recipes/:id
Response: { message: "Recipe deleted successfully" }

POST   /api/recipes/:id/details
Body: { materialId, quantity, unit, sequence }
Response: { id, materialId, quantity, ... }

PUT    /api/recipes/:id/details/:detailId
Body: { materialId, quantity, unit, sequence }
Response: { id, materialId, quantity, ... }

DELETE /api/recipes/:id/details/:detailId
Response: { message: "Ingredient removed successfully" }
```

### 6.4 Cost Calculation Endpoints

```
POST   /api/cost-standards/calculate
Body: { menuItemId, priceDate }
Response: { 
  materialCost: 25000,
  laborCost: 25000,
  overheadCost: 25000,
  totalCost: 75000,
  costPerPortion: 7500
}

GET    /api/cost-standards/:menuItemId
Response: { id, menuItemId, materialCost, laborCost, overheadCost, totalCost, costPerPortion }

GET    /api/cost-standards/history/:menuItemId
Query: { startDate, endDate }
Response: [{ id, effectiveDate, totalCost, ... }, ...]
```

### 6.5 Production Endpoints

```
GET    /api/production-logs
Query: { page, limit, startDate, endDate, menuItemId }
Response: { data: [...], total, page, limit }

POST   /api/production-logs
Body: { menuItemId, productionDate, portionsProduced, portionsSold, laborHoursActual, notes }
Response: { id, menuItemId, productionDate, ... }

GET    /api/production-logs/:id
Response: { id, menuItemId, productionDate, details: [...], variance: {...} }

PUT    /api/production-logs/:id
Body: { menuItemId, productionDate, portionsProduced, portionsSold, laborHoursActual, notes }
Response: { id, menuItemId, ... }

DELETE /api/production-logs/:id
Response: { message: "Production log deleted successfully" }

POST   /api/production-logs/:id/details
Body: { materialId, quantityUsed, unit, unitPrice }
Response: { id, materialId, quantityUsed, subtotal }

PUT    /api/production-logs/:id/details/:detailId
Body: { materialId, quantityUsed, unit, unitPrice }
Response: { id, materialId, quantityUsed, subtotal }

DELETE /api/production-logs/:id/details/:detailId
Response: { message: "Material usage removed successfully" }
```

### 6.6 Variance Analysis Endpoints

```
GET    /api/variance-analysis/date-range
Query: { startDate, endDate, menuItemId }
Response: [{ id, menuItemId, varianceDate, standardCost, actualCost, variance, variancePercentage }, ...]

POST   /api/variance-analysis/calculate
Body: { productionLogId }
Response: { 
  materialPriceVariance: 500,
  laborEfficiencyVariance: 200,
  overheadVariance: 100,
  totalVariance: 800,
  variancePercentage: 10.67
}

GET    /api/variance-analysis/summary
Query: { startDate, endDate }
Response: {
  totalVariance: 5000,
  averageVariancePercentage: 8.5,
  favorableCount: 12,
  unfavorableCount: 8,
  byType: { materialPrice: {...}, laborEfficiency: {...}, ... }
}
```

### 6.7 Report Endpoints

```
GET    /api/reports/monthly
Query: { month, year }
Response: {
  period: "January 2024",
  totalRevenue: 50000000,
  totalFoodCost: 15000000,
  totalLaborCost: 12500000,
  totalOverheadCost: 5000000,
  foodCostPercentage: 30,
  laborCostPercentage: 25,
  overheadCostPercentage: 10,
  netProfit: 17500000,
  profitMargin: 35
}

GET    /api/reports/menu-profitability
Query: { startDate, endDate }
Response: [
  {
    menuItemId: "...",
    menuName: "Kopi Susu Original",
    totalSold: 150,
    costPerPortion: 8000,
    sellingPrice: 20000,
    margin: 12000,
    marginPercentage: 60,
    totalRevenue: 3000000,
    totalCost: 1200000,
    totalProfit: 1800000
  },
  ...
]

GET    /api/reports/cost-trends
Query: { startDate, endDate, menuItemId }
Response: [
  { date: "2024-01-01", averageCost: 8000, minCost: 7500, maxCost: 8500 },
  ...
]

POST   /api/reports/export
Body: { reportType: "monthly" | "profitability" | "trends", format: "pdf" | "excel", startDate, endDate }
Response: File download
```

---

## BAGIAN 7: SECURITY BEST PRACTICES

### 7.1 Authentication & Authorization

```javascript
// JWT Token Implementation
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Generate token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

// Verify token middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### 7.2 Input Validation & Sanitization

```javascript
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRecipe = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('standardPortion').isInt({ min: 1 }).withMessage('Portion must be positive'),
  body('standardLaborHours').isFloat({ min: 0 }).withMessage('Labor hours must be non-negative'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Usage in route
router.post('/recipes', authMiddleware, validateRecipe, createRecipe);
```

### 7.3 Data Protection

- Use HTTPS/TLS for all communications
- Hash sensitive data (passwords, API keys)
- Implement rate limiting for API endpoints
- Use environment variables for secrets
- Implement CORS properly
- Validate and sanitize all inputs
- Use parameterized queries to prevent SQL injection
- Implement audit logging for sensitive operations

### 7.4 Database Security

```javascript
// Use parameterized queries with Prisma
const user = await prisma.user.findUnique({
  where: { email: userEmail }
});

// Never concatenate user input into queries
// Bad: `SELECT * FROM users WHERE email = '${email}'`
// Good: Use Prisma or prepared statements
```

---

## BAGIAN 8: PERFORMANCE OPTIMIZATION

### 8.1 Frontend Optimization

```javascript
// Code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const RecipeForm = React.lazy(() => import('./pages/Recipe/RecipeForm'));

// Memoization
const RecipeList = React.memo(({ recipes }) => {
  return recipes.map(recipe => <RecipeItem key={recipe.id} recipe={recipe} />);
});

// Lazy loading images
<img loading="lazy" src={imageUrl} alt="description" />

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';
```

### 8.2 Backend Optimization

```javascript
// Database indexing
// In Prisma schema
model RawMaterial {
  id String @id @default(cuid())
  businessId String
  code String @unique
  name String
  
  @@index([businessId])
  @@index([code])
}

// Query optimization - select only needed fields
const materials = await prisma.rawMaterial.findMany({
  select: {
    id: true,
    name: true,
    currentPrice: true
  },
  where: { businessId }
});

// Pagination
const materials = await prisma.rawMaterial.findMany({
  skip: (page - 1) * limit,
  take: limit,
  where: { businessId }
});

// Caching
const redis = require('redis');
const client = redis.createClient();

const getMaterials = async (businessId) => {
  const cacheKey = `materials:${businessId}`;
  const cached = await client.get(cacheKey);
  
  if (cached) return JSON.parse(cached);
  
  const materials = await prisma.rawMaterial.findMany({
    where: { businessId }
  });
  
  await client.setex(cacheKey, 3600, JSON.stringify(materials));
  return materials;
};
```

### 8.3 API Response Optimization

```javascript
// Compression
const compression = require('compression');
app.use(compression());

// Pagination
GET /api/materials?page=1&limit=20

// Field selection
GET /api/materials?fields=id,name,price

// Filtering & sorting
GET /api/materials?category=beverage&sort=-price
```

---

## BAGIAN 9: TESTING STRATEGY

### 9.1 Unit Tests

```javascript
// Jest test example
describe('Cost Calculation Service', () => {
  test('should calculate material cost with yield adjustment', () => {
    const recipe = {
      ingredients: [
        { materialId: 'mat1', quantity: 0.1 }
      ]
    };
    
    const materials = {
      'mat1': { price: 15000, yield: 90 }
    };
    
    const cost = calculateMaterialCost(recipe, materials);
    expect(cost).toBeCloseTo(1667, 0);
  });

  test('should calculate total cost correctly', () => {
    const costs = {
      material: 25000,
      labor: 25000,
      overhead: 25000
    };
    
    const total = calculateTotalCost(costs);
    expect(total).toBe(75000);
  });
});
```

### 9.2 Integration Tests

```javascript
describe('Recipe API', () => {
  test('should create recipe with ingredients', async () => {
    const response = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Recipe',
        category: 'beverage',
        standardPortion: 1,
        standardLaborHours: 0.5,
        ingredients: [
          { materialId: 'mat1', quantity: 0.1, unit: 'kg' }
        ]
      });
    
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('Test Recipe');
  });
});
```

### 9.3 E2E Tests

```javascript
// Cypress test example
describe('Recipe Creation Flow', () => {
  it('should create a new recipe successfully', () => {
    cy.login('user@example.com', 'password');
    cy.visit('/recipes');
    cy.contains('Create Recipe').click();
    
    cy.get('input[name="name"]').type('Kopi Susu Original');
    cy.get('select[name="category"]').select('beverage');
    cy.get('input[name="standardPortion"]').type('1');
    cy.get('input[name="standardLaborHours"]').type('0.5');
    
    cy.contains('Add Ingredient').click();
    cy.get('select[name="ingredients.0.materialId"]').select('Creamer');
    cy.get('input[name="ingredients.0.quantity"]').type('2.5');
    
    cy.contains('Save Recipe').click();
    cy.contains('Recipe created successfully').should('be.visible');
  });
});
```

---

## BAGIAN 10: DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Backup strategy defined
- [ ] Monitoring setup configured
- [ ] Documentation updated
- [ ] User guide prepared

### Deployment

- [ ] Database backup created
- [ ] Code deployed to staging
- [ ] Smoke tests on staging passed
- [ ] Code deployed to production
- [ ] Health checks passing
- [ ] Monitoring alerts active
- [ ] Rollback plan ready

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify user access
- [ ] Review logs for issues
- [ ] Communicate with users
- [ ] Document deployment details
- [ ] Plan follow-up improvements

---

## BAGIAN 11: MONITORING & MAINTENANCE

### 11.1 Key Metrics to Monitor

```javascript
// Application metrics
- Request response time
- Error rate
- Database query time
- Memory usage
- CPU usage
- Active users
- API endpoint performance

// Business metrics
- Cost calculation accuracy
- Variance analysis timeliness
- Report generation time
- User engagement
- Feature usage
```

### 11.2 Logging Strategy

```javascript
// Winston logger setup
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Recipe created', { recipeId, userId });
logger.error('Cost calculation failed', { error, recipeId });
```

### 11.3 Maintenance Schedule

**Daily:**
- Monitor error logs
- Check system health
- Verify backups

**Weekly:**
- Review performance metrics
- Check database size
- Update security patches

**Monthly:**
- Database optimization
- Code cleanup
- Feature planning

**Quarterly:**
- Security audit
- Performance review
- User feedback analysis

---

## BAGIAN 12: FUTURE ENHANCEMENTS

**Phase 3 & Beyond:**
1. Machine learning for cost prediction
2. Inventory optimization
3. Supplier comparison & negotiation
4. Multi-currency support
5. Advanced forecasting
6. Integration with accounting software
7. Mobile app for field staff
8. Real-time collaboration features
9. Advanced analytics & BI
10. Blockchain for supply chain tracking

---

## QUICK START GUIDE

### For Developers

```bash
# 1. Clone repository
git clone <repo-url>
cd costflow

# 2. Setup backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

# 3. Setup frontend (in new terminal)
cd frontend
npm install
npm run dev

# 4. Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# API Docs: http://localhost:3000/api-docs
```

### For Users

1. Register account at http://localhost:5173/register
2. Setup business information
3. Add raw materials & suppliers
4. Create menu items & recipes
5. Perform yield testing
6. Start logging daily production
7. Review variance analysis & reports

---

**END OF META-FRAMEWORK**

Dokumen ini adalah blueprint lengkap untuk mengembangkan web app akuntansi biaya produksi. Semua komponen, endpoint, dan prosedur sudah dijelaskan secara detail dan siap untuk diimplementasikan.

Untuk pertanyaan atau klarifikasi lebih lanjut, silakan merujuk ke bagian yang relevan atau hubungi tim development.
