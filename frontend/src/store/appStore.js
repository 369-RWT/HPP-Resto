import { create } from 'zustand';

const useAppStore = create((set) => ({
    businessSettings: null,
    isInitialized: false,
    loading: false,
    error: null,

    setBusinessSettings: (settings) => set({ businessSettings: settings }),
    setIsInitialized: (value) => set({ isInitialized: value }),
    setLoading: (value) => set({ loading: value }),
    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),
}));

export default useAppStore;
