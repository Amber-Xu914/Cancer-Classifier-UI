import { useState } from "react";
import { DEFAULT_CANCER_TYPE, DEFAULT_SUMMARY } from "../Constants/Common/DashboardDefaults";
import { DashboardContext } from "../Contexts/DashboardContexts";

export default function MethylationClassifierProvider({ children }: { children: React.ReactNode }) {
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
