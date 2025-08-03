import { useState } from "react";
import { DashboardContext } from "./DashboardContexts";
import { DEFAULT_CANCER_TYPE, DEFAULT_SUMMARY } from "../Constants/DashboardDefaults";

interface MethylationClassifierProviderProps {
    children: React.ReactNode;
}

export default function MethylationClassifierProvider({
    children
}: MethylationClassifierProviderProps) {
    const [searchQuery, setSearchQuery] = useState(DEFAULT_SUMMARY);
    const [cancerType, setCancerType] = useState(DEFAULT_CANCER_TYPE);

    const resetDashboard = () => {
        setSearchQuery(DEFAULT_SUMMARY);
        setCancerType(DEFAULT_CANCER_TYPE);
    };

    return (
        <DashboardContext.Provider value={{
            searchQuery,
            cancerType,
            setSearchQuery,
            setCancerType,
            resetDashboard
        }}>
            {children}
        </DashboardContext.Provider>
    );
}