# Create sample menu items via API
$baseUrl = "http://localhost:3000/api/menu-items"
$headers = @{ "Content-Type" = "application/json" }

Write-Host "`nCreating sample menu items..." -ForegroundColor Cyan

# Sample menu items
$menuItems = @(
    @{
        code                = "BURGER-01"
        name                = "Classic Burger"
        category            = "Main Course"
        standardPortion     = 1
        standardPortionUnit = "portion"
        standardLaborHours  = 1.5
        isActive            = $true
    },
    @{
        code                = "PASTA-01"
        name                = "Carbonara Pasta"
        category            = "Main Course"
        standardPortion     = 1
        standardPortionUnit = "plate"
        standardLaborHours  = 2.0
        isActive            = $true
    },
    @{
        code                = "SALAD-01"
        name                = "Caesar Salad"
        category            = "Appetizer"
        standardPortion     = 1
        standardPortionUnit = "serving"
        standardLaborHours  = 0.5
        isActive            = $true
    },
    @{
        code                = "SOUP-01"
        name                = "Tomato Soup"
        category            = "Appetizer"
        standardPortion     = 1
        standardPortionUnit = "serving"
        standardLaborHours  = 0.75
        isActive            = $true
    },
    @{
        code                = "CAKE-01"
        name                = "Chocolate Cake"
        category            = "Dessert"
        standardPortion     = 1
        standardPortionUnit = "portion"
        standardLaborHours  = 3.0
        isActive            = $true
    }
)

$created = 0
foreach ($item in $menuItems) {
    try {
        $body = $item | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -Headers $headers
        Write-Host "✅ Created: $($item.code) - $($item.name)" -ForegroundColor Green
        $created++
    }
    catch {
        Write-Host "⚠️  Skipped: $($item.code) (may already exist)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Successfully created $created menu items!" -ForegroundColor Green
Write-Host "Visit http://localhost:5174/menu-items to view them in the UI`n" -ForegroundColor Cyan
