# PowerShell Fix and npm Install Guide

## Issue
PowerShell execution policy is blocking npm commands on your system.

---

## Solution 1: Fix PowerShell Policy (Recommended)

### Step 1: Open PowerShell as Administrator
1. Press `Windows + X`
2. Select **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**

### Step 2: Run This Command
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 3: Confirm
- Type `Y` and press Enter when prompted

### Step 4: Install Package
```bash
cd "C:\Users\M S I\BM cost\HPP-Resto\frontend"
npm install notistack
```

---

## Solution 2: Use Command Prompt (Quick Alternative)

### Step 1: Open Command Prompt
1. Press `Windows + R`
2. Type `cmd` and press Enter

### Step 2: Navigate and Install
```cmd
cd "C:\Users\M S I\BM cost\HPP-Resto\frontend"
npm install notistack
```

---

## Solution 3: Use Git Bash

If you have Git installed:

```bash
cd "/c/Users/M S I/BM cost/HPP-Resto/frontend"
npm install notistack
```

---

## Verification

After installation, verify with:
```bash
npm list notistack
```

Expected output:
```
frontend@0.0.0
└── notistack@3.0.1
```

---

## What Gets Installed

- **Package:** notistack@3.0.1
- **Size:** ~50KB
- **Purpose:** Toast notification system
- **Dependencies:** None (uses existing React & MUI)

---

## After Installation

Once installed, you can run the app:

```bash
# Start backend (optional)
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev
```

The app will now have:
- ✅ Toast notifications (instead of alerts)
- ✅ Skeleton loaders on all tables
- ✅ Better accessibility (ARIA labels, keyboard nav)

---

## Current Status

**Infrastructure:** ✅ Complete
**Dependency:** ⏳ Needs installation
**Page Integration:** ⏳ Ready for toast updates

**This is the only remaining step to enable the new UX features!**
