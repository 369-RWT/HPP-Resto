# How to Unblock PowerShell Execution Policy

## ⚠️ Current Issue
PowerShell is blocking npm commands with this error:
```
npm.ps1 cannot be loaded because running scripts is disabled on this system
```

---

## ✅ Solution: Fix PowerShell Execution Policy

### Step 1: Open PowerShell as Administrator

**Method 1: Using Start Menu**
1. Press `Windows` key
2. Type "PowerShell"
3. **Right-click** on "Windows PowerShell"
4. Select **"Run as administrator"**
5. Click "Yes" on the UAC prompt

**Method 2: Using Windows Terminal**
1. Press `Windows + X`
2. Select **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**
3. Click "Yes" on the UAC prompt

---

### Step 2: Run This Command

Copy and paste this exact command:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Press **Enter**

---

### Step 3: Confirm the Change

When prompted:
```
Execution Policy Change
The execution policy helps protect you from scripts that you do not trust...
Do you want to change the execution policy?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):
```

Type **`Y`** and press **Enter**

---

### Step 4: Verify It Worked

Run this command to check:
```powershell
Get-ExecutionPolicy
```

Expected output: **`RemoteSigned`**

---

### Step 5: Test npm Commands

Close and reopen PowerShell (no admin needed now), then test:
```powershell
npm --version
```

Should display version without errors!

---

## 🎯 What This Does

**RemoteSigned Policy:**
- ✅ Allows local scripts to run
- ✅ Allows npm and other tools to work
- ✅ Requires downloaded scripts to be signed
- ✅ Safe for development
- ✅ Only affects your user account

This is the **recommended setting for developers**.

---

## 🔄 Alternative: One-Time Bypass (Not Recommended)

If you can't change the policy, run this before each npm command:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

But this is tedious - better to fix it permanently!

---

## ✅ After Fixing

You'll be able to run:
```bash
npm install
npm run dev
npm run build
npm audit
# ... all npm commands work!
```

---

## 🚀 Then Start Your App

Once fixed, you can run:

**Backend:**
```powershell
cd "C:\Users\M S I\BM cost\HPP-Resto\backend"
npm run dev
```

**Frontend:**
```powershell
cd "C:\Users\M S I\BM cost\HPP-Resto\frontend"
npm run dev
```

Or just double-click:
- `start-backend.bat`
- `start-frontend.bat`

---

## ❓ Troubleshooting

**"Access Denied" error?**
- You didn't run PowerShell as Administrator
- Close PowerShell and start over with "Run as administrator"

**Still getting errors?**
- Check if company/organization policy blocks this
- Try using **Command Prompt (CMD)** instead:
  ```cmd
  cd "C:\Users\M S I\BM cost\HPP-Resto\frontend"
  npm run dev
  ```

**Want to revert?**
```powershell
Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser
```

---

## 📋 Quick Reference

| Command | Purpose |
|---------|---------|
| `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` | Fix npm (recommended) |
| `Get-ExecutionPolicy` | Check current policy |
| `Set-ExecutionPolicy Restricted -Scope CurrentUser` | Revert to default |

---

**This is a one-time fix - you only need to do it once!**
