# Backend Security Audit & Load Test Guide

## Quick Start

### 1. Fix PowerShell Execution Policy (One-time setup)

**Option A: Change Policy (Recommended)**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Option B: Use CMD Instead**
Open Command Prompt (CMD) instead of PowerShell and run commands normally.

---

## Security Audit

### Run npm audit
```bash
cd backend
npm audit
```

**Expected Output:**
- Shows vulnerabilities (if any)
- Categorized by severity: critical, high, moderate, low

### Fix Vulnerabilities
```bash
# Automatic fix (may cause breaking changes)
npm audit fix

# Manual review recommended
npm audit fix --dry-run

# Force fix (use with caution)
npm audit fix --force
```

---

## Load Testing

### Setup
```bash
cd backend

# Install axios if not already installed
npm install axios

# Make sure backend is running in another terminal
npm run dev
```

### Run Load Test
```bash
node loadtest.js
```

### What It Tests
The load test script tests all major endpoints:
- ✅ Dashboard stats (`/reports/dashboard`)
- ✅ List suppliers (`/suppliers`)
- ✅ List materials (`/materials`)
- ✅ List menu items (`/menu-items`)
- ✅ List production logs (`/production-logs`)
- ✅ List yield tests (`/yield-tests`)
- ✅ Business settings (`/business-settings`)

### Test Configuration
- **Concurrent Requests:** 10
- **Iterations:** 5
- **Total Requests:** 350 (7 endpoints × 5 iterations × 10 concurrent)

### Expected Results
```
═══════════════════════════════════════════
  Test Summary
═══════════════════════════════════════════

Total Requests:    350
Successful:        350
Failed:            0
Success Rate:      100.00%
Total Duration:    2.50s
Requests/Second:   140.00

✓ ALL TESTS PASSED
```

---

## Manual Testing Checklist

### 1. API Endpoints Test

**Suppliers:**
```bash
curl http://localhost:3000/api/suppliers
```

**Materials:**
```bash
curl http://localhost:3000/api/materials
```

**Menu Items:**
```bash
curl http://localhost:3000/api/menu-items
```

### 2. POST Requests Test

**Create Supplier:**
```bash
curl -X POST http://localhost:3000/api/suppliers \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Supplier\",\"contactPerson\":\"John\",\"phone\":\"123456\"}"
```

### 3. Database Test
```bash
# Check if database exists
ls backend/dev.db

# Prisma studio (visual database viewer)
cd backend
npx prisma studio
```

---

## Performance Benchmarks

### Target Metrics
- **Response Time:** < 200ms (avg)
- **Success Rate:** ≥ 99%
- **Concurrent Users:** 10+ without degradation
- **Throughput:** ≥ 100 req/s

### Monitoring
Check these during load test:
1. CPU usage (should be < 80%)
2. Memory usage (stable, no leaks)
3. Database connections (properly closed)
4. Response times (consistent)

---

## Common Issues & Solutions

### Issue 1: Server Not Running
**Error:** `Error: Backend server is not running!`

**Solution:**
```bash
cd backend
npm run dev
```

### Issue 2: Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Issue 3: Database Locked
**Error:** `database is locked`

**Solution:**
```bash
# Close all connections
# Restart backend server
```

### Issue 4: npm audit Vulnerabilities
**Solution:**
```bash
# Review vulnerabilities
npm audit

# Check if they affect your code
npm audit --production

# Update dependencies
npm update

# Fix automatically (test after!)
npm audit fix
```

---

## Security Best Practices

### 1. Dependencies
- ✅ Run `npm audit` regularly
- ✅ Keep dependencies updated
- ✅ Remove unused packages

### 2. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use strong secrets
- ✅ Rotate API keys regularly

### 3. API Security
- ✅ Input validation (Joi)
- ✅ SQL injection protection (Prisma ORM)
- ✅ CORS configured
- ✅ Helmet for security headers

### 4. Database
- ✅ Regular backups
- ✅ Use transactions
- ✅ Index important columns

---

## Advanced Load Testing

### Using Artillery (Optional)

**Install:**
```bash
npm install -g artillery
```

**Create Test Config (artillery.yml):**
```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
    - get:
        url: "/api/suppliers"
    - get:
        url: "/api/materials"
    - get:
        url: "/api/menu-items"
```

**Run:**
```bash
artillery run artillery.yml
```

---

## Automated Testing

### Run All Tests
```bash
# 1. Security audit
npm audit

# 2. Load test
node loadtest.js

# 3. Database health check
npx prisma migrate status

# 4. Lint check (if configured)
npm run lint
```

---

## Continuous Monitoring

### Recommendations:
1. **Set up logging** (Winston, Morgan)
2. **Add health check endpoint** (`/health`)
3. **Monitor database size**
4. **Track API response times**
5. **Set up alerts** for failures

---

## Expected Audit Results

### Clean Audit Output:
```
found 0 vulnerabilities
```

### If Vulnerabilities Found:
1. Review each one
2. Check if it affects your code
3. Update if safe
4. Document any exceptions

---

## Load Test Results Interpretation

### Success Rate
- **100%**: Excellent ✅
- **95-99%**: Good ✅
- **90-94%**: Acceptable ⚠️
- **<90%**: Needs investigation ❌

### Response Time
- **<100ms**: Excellent ✅
- **100-200ms**: Good ✅
- **200-500ms**: Acceptable ⚠️
- **>500ms**: Slow ❌

### Requests/Second
- **>100**: Excellent ✅
- **50-100**: Good ✅
- **20-50**: Acceptable ⚠️
- **<20**: Needs optimization ❌

---

## Next Steps After Testing

1. ✅ Review audit results
2. ✅ Fix critical vulnerabilities
3. ✅ Document performance baselines
4. ✅ Set up monitoring
5. ✅ Schedule regular audits
