import { createContext, useContext } from 'react';

interface ClassifierContextType {
    searchQuery: string;
    cancerType: string;
    setSearchQuery: (val: string) => void;
    setCancerType: (val: string) => void;
    resetDashboard: () => void;
}

export const ClassifierContext = createContext<ClassifierContextType | null>(null);

export const useClassifier = () => {
    const context = useContext(ClassifierContext);
    if (!context) {
        throw new Error('useClassifier must be used within a ClassifierContext.Provider');
    }
    return context;
};
