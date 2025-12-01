import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import RawMaterials from './pages/RawMaterials';
import MenuItems from './pages/MenuItems';
import RecipeDetails from './pages/RecipeDetails';
import YieldTesting from './pages/YieldTesting';
import ProductionLog from './pages/ProductionLog';
import CostCalculation from './pages/CostCalculation';
import VarianceAnalysis from './pages/VarianceAnalysis';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Layout
import Layout from './components/Layout/Layout';
import ToastProvider from './components/ToastProvider';

// Create custom theme
// Create custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A1A1A', // Deep Charcoal/Black
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C5A059', // Muted Gold
      light: '#E6C47F',
      dark: '#94763B',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32', // Deep Green
      light: '#4CAF50',
    },
    warning: {
      main: '#ED6C02', // Muted Orange
    },
    error: {
      main: '#D32F2F', // Deep Red
    },
    background: {
      default: '#FAFAFA', // Warm White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
  typography: {
    fontFamily: [
      '"Plus Jakarta Sans"',
      '"Inter"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700, letterSpacing: '-0.03em', color: '#1A1A1A' },
    h2: { fontWeight: 600, letterSpacing: '-0.02em', color: '#1A1A1A' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em', color: '#1A1A1A' },
    h4: { fontWeight: 600, letterSpacing: '-0.02em', color: '#1A1A1A' },
    h5: { fontWeight: 500, letterSpacing: '-0.01em' },
    h6: { fontWeight: 500, letterSpacing: '0em' },
    subtitle1: { letterSpacing: '-0.01em', color: '#666666' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 8, // Slightly sharper than before
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAFAFA',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.03)',
        },
        elevation1: {
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          color: '#1A1A1A',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s',
          '&.Mui-selected': {
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#333333',
            },
            '& .MuiListItemIcon-root': {
              color: '#FFFFFF',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: '#888888',
          transition: 'color 0.2s',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#666666',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          backgroundColor: '#FAFAFA',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        },
        body: {
          fontSize: '0.875rem',
          color: '#1A1A1A',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
        filled: {
          border: '1px solid transparent',
        },
        outlined: {
          borderWidth: '1px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="materials" element={<RawMaterials />} />
              <Route path="menu-items" element={<MenuItems />} />
              <Route path="menu-items/:id/recipe" element={<RecipeDetails />} />
              <Route path="yield-testing" element={<YieldTesting />} />
              <Route path="production-log" element={<ProductionLog />} />
              <Route path="cost-calculation" element={<CostCalculation />} />
              <Route path="variance-analysis" element={<VarianceAnalysis />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
