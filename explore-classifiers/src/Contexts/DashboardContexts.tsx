import { createContext, useContext } from 'react';

interface DashboardContextType {
  resetDashboard: () => void;
}

export const DashboardContext = createContext<DashboardContextType>({
  resetDashboard: () => {},
});

export const useDashboard = () => useContext(DashboardContext);
