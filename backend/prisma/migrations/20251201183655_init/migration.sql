-- CreateTable
CREATE TABLE "BusinessSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "businessName" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "fiscalYearStart" INTEGER NOT NULL DEFAULT 1,
    "laborRatePerHour" REAL NOT NULL DEFAULT 0,
    "isInitialized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "paymentTerms" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RawMaterial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "category" TEXT,
    "currentPrice" REAL NOT NULL,
    "yieldPercentage" REAL NOT NULL DEFAULT 100,
    "supplierId" INTEGER,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RawMaterial_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "standardPortion" INTEGER NOT NULL,
    "standardPortionUnit" TEXT NOT NULL,
    "standardLaborHours" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecipeDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "menuItemId" INTEGER NOT NULL,
    "rawMaterialId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "sequence" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RecipeDetail_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecipeDetail_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YieldTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rawMaterialId" INTEGER NOT NULL,
    "testDate" DATETIME NOT NULL,
    "apWeight" REAL NOT NULL,
    "epWeight" REAL NOT NULL,
    "yieldPercentage" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "YieldTest_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "menuItemId" INTEGER NOT NULL,
    "productionDate" DATETIME NOT NULL,
    "portionsProduced" INTEGER NOT NULL,
    "portionsSold" INTEGER,
    "laborHoursActual" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductionLog_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductionLogDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productionLogId" INTEGER NOT NULL,
    "rawMaterialId" INTEGER NOT NULL,
    "quantityUsed" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    CONSTRAINT "ProductionLogDetail_productionLogId_fkey" FOREIGN KEY ("productionLogId") REFERENCES "ProductionLog" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductionLogDetail_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "RawMaterial" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CostStandard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "menuItemId" INTEGER NOT NULL,
    "effectiveDate" DATETIME NOT NULL,
    "materialCost" REAL NOT NULL,
    "laborCost" REAL NOT NULL,
    "overheadCost" REAL NOT NULL,
    "totalCost" REAL NOT NULL,
    "costPerPortion" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CostStandard_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OverheadConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "allocationMethod" TEXT NOT NULL,
    "allocationRate" REAL NOT NULL,
    "effectiveDate" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VarianceRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "menuItemId" INTEGER NOT NULL,
    "productionLogId" INTEGER,
    "varianceDate" DATETIME NOT NULL,
    "standardCost" REAL NOT NULL,
    "actualCost" REAL NOT NULL,
    "varianceAmount" REAL NOT NULL,
    "variancePercentage" REAL NOT NULL,
    "varianceType" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VarianceRecord_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VarianceRecord_productionLogId_fkey" FOREIGN KEY ("productionLogId") REFERENCES "ProductionLog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MenuPricing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "menuItemId" INTEGER NOT NULL,
    "effectiveDate" DATETIME NOT NULL,
    "sellingPrice" REAL NOT NULL,
    "costPerPortion" REAL,
    "marginAmount" REAL,
    "marginPercentage" REAL,
    "foodCostPercentage" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MenuPricing_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RawMaterial_code_key" ON "RawMaterial"("code");

-- CreateIndex
CREATE INDEX "RawMaterial_code_idx" ON "RawMaterial"("code");

-- CreateIndex
CREATE INDEX "RawMaterial_supplierId_idx" ON "RawMaterial"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_code_key" ON "MenuItem"("code");

-- CreateIndex
CREATE INDEX "MenuItem_code_idx" ON "MenuItem"("code");

-- CreateIndex
CREATE INDEX "RecipeDetail_menuItemId_idx" ON "RecipeDetail"("menuItemId");

-- CreateIndex
CREATE INDEX "RecipeDetail_rawMaterialId_idx" ON "RecipeDetail"("rawMaterialId");

-- CreateIndex
CREATE INDEX "YieldTest_rawMaterialId_idx" ON "YieldTest"("rawMaterialId");

-- CreateIndex
CREATE INDEX "YieldTest_testDate_idx" ON "YieldTest"("testDate");

-- CreateIndex
CREATE INDEX "ProductionLog_menuItemId_idx" ON "ProductionLog"("menuItemId");

-- CreateIndex
CREATE INDEX "ProductionLog_productionDate_idx" ON "ProductionLog"("productionDate");

-- CreateIndex
CREATE INDEX "ProductionLogDetail_productionLogId_idx" ON "ProductionLogDetail"("productionLogId");

-- CreateIndex
CREATE INDEX "ProductionLogDetail_rawMaterialId_idx" ON "ProductionLogDetail"("rawMaterialId");

-- CreateIndex
CREATE INDEX "CostStandard_menuItemId_idx" ON "CostStandard"("menuItemId");

-- CreateIndex
CREATE INDEX "CostStandard_effectiveDate_idx" ON "CostStandard"("effectiveDate");

-- CreateIndex
CREATE INDEX "OverheadConfig_effectiveDate_idx" ON "OverheadConfig"("effectiveDate");

-- CreateIndex
CREATE INDEX "VarianceRecord_menuItemId_idx" ON "VarianceRecord"("menuItemId");

-- CreateIndex
CREATE INDEX "VarianceRecord_productionLogId_idx" ON "VarianceRecord"("productionLogId");

-- CreateIndex
CREATE INDEX "VarianceRecord_varianceDate_idx" ON "VarianceRecord"("varianceDate");

-- CreateIndex
CREATE INDEX "MenuPricing_menuItemId_idx" ON "MenuPricing"("menuItemId");

-- CreateIndex
CREATE INDEX "MenuPricing_effectiveDate_idx" ON "MenuPricing"("effectiveDate");
