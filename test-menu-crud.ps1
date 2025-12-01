# PowerShell script to test Menu CRUD operations
$baseUrl = "http://localhost:3000/api/menu-items"
$headers = @{ "Content-Type" = "application/json" }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Menu CRUD Operations Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: CREATE
Write-Host "[1] CREATE - Adding new menu item..." -ForegroundColor Yellow
$createData = @{
    code = "DEMO-001"
    name = "Demo Burger"
    category = "Main Course"
    standardPortion = 1
    standardPortionUnit = "portion"
    standardLaborHours = 2.5
    isActive = $true
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $createData -Headers $headers
    Write-Host "✅ CREATE Success!" -ForegroundColor Green
    Write-Host "   ID: $($createResponse.id)" -ForegroundColor Gray
    Write-Host "   Code: $($createResponse.code)" -ForegroundColor Gray
    Write-Host "   Name: $($createResponse.name)`n" -ForegroundColor Gray
    $itemId = $createResponse.id
} catch {
    Write-Host "❌ CREATE Failed: $_`n" -ForegroundColor Red
    exit 1
}

# Test 2: READ (All)
Write-Host "[2] READ - Fetching all menu items..." -ForegroundColor Yellow
try {
    $readAllResponse = Invoke-RestMethod -Uri "${baseUrl}?page=1&limit=20" -Method Get
    Write-Host "✅ READ All Success!" -ForegroundColor Green
    Write-Host "   Total Items: $($readAllResponse.pagination.total)" -ForegroundColor Gray
    Write-Host "   Items Found:" -ForegroundColor Gray
    foreach ($item in $readAllResponse.data) {
        Write-Host "     - $($item.code): $($item.name) ($($item.category))" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ READ All Failed: $_`n" -ForegroundColor Red
}

# Test 3: READ (Single)
Write-Host "[3] READ - Fetching single menu item (ID: $itemId)..." -ForegroundColor Yellow
try {
    $readOneResponse = Invoke-RestMethod -Uri "$baseUrl/$itemId" -Method Get
    Write-Host "✅ READ Single Success!" -ForegroundColor Green
    Write-Host "   Code: $($readOneResponse.code)" -ForegroundColor Gray
    Write-Host "   Name: $($readOneResponse.name)" -ForegroundColor Gray
    Write-Host "   Category: $($readOneResponse.category)" -ForegroundColor Gray
    Write-Host "   Labor Hours: $($readOneResponse.standardLaborHours)h`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ READ Single Failed: $_`n" -ForegroundColor Red
}

# Test 4: UPDATE
Write-Host "[4] UPDATE - Updating menu item..." -ForegroundColor Yellow
$updateData = @{
    code = "DEMO-001"
    name = "Updated Demo Burger"
    category = "Appetizer"
    standardPortion = 1
    standardPortionUnit = "portion"
    standardLaborHours = 3.0
    isActive = $true
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/$itemId" -Method Put -Body $updateData -Headers $headers
    Write-Host "✅ UPDATE Success!" -ForegroundColor Green
    Write-Host "   New Name: $($updateResponse.name)" -ForegroundColor Gray
    Write-Host "   New Category: $($updateResponse.category)" -ForegroundColor Gray
    Write-Host "   New Labor Hours: $($updateResponse.standardLaborHours)h`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ UPDATE Failed: $_`n" -ForegroundColor Red
}

# Test 5: READ (Verify Update)
Write-Host "[5] READ - Verifying update..." -ForegroundColor Yellow
try {
    $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/$itemId" -Method Get
    Write-Host "✅ Verification Success!" -ForegroundColor Green
    Write-Host "   Confirmed Name: $($verifyResponse.name)" -ForegroundColor Gray
    Write-Host "   Confirmed Category: $($verifyResponse.category)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Verification Failed: $_`n" -ForegroundColor Red
}

# Test 6: DELETE
Write-Host "[6] DELETE - Deleting menu item..." -ForegroundColor Yellow
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/$itemId" -Method Delete
    Write-Host "✅ DELETE Success!" -ForegroundColor Green
    Write-Host "   Message: $($deleteResponse.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ DELETE Failed: $_`n" -ForegroundColor Red
}

# Test 7: READ (Verify Delete)
Write-Host "[7] READ - Verifying deletion..." -ForegroundColor Yellow
try {
    $finalResponse = Invoke-RestMethod -Uri "${baseUrl}?page=1&limit=20" -Method Get
    Write-Host "✅ Final Verification Success!" -ForegroundColor Green
    Write-Host "   Remaining Items: $($finalResponse.pagination.total)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Final Verification Failed: $_`n" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CRUD Test Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
