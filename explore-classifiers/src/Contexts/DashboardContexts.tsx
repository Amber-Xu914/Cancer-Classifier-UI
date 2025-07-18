import { createContext, useContext } from 'react';

interface DashboardContextType {
    searchQuery: string;
    cancerType: string;
    setSearchQuery: (val: string) => void;
    setCancerType: (val: string) => void;
    resetDashboard: () => void;
}

export const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardContext.Provider');
    }
    return context;
};
