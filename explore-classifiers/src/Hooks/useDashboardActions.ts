import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_CANCER_TYPE, DEFAULT_SUMMARY } from "../Constants/DashboardDefaults";
import { useDashboard } from "../Contexts";

export interface DashboardState {
    searchQuery: string;
    cancerType: string;
}

export interface DashboardActions {
    setSearchQuery: (query: string) => void;
    setCancerType: (type: string) => void;
    resetDashboard: () => void;
    handleSearch: (filter: string, value: string | null) => void;
    handleSunburstClick: (value: string | null) => void;
}

export const useDashboardActions = () => {
    const navigate = useNavigate();
    const { setSearchQuery, setCancerType } = useDashboard();

    const handleSearch = useCallback((filter: string, value: string | null) => {
        if (!value) return;

        if (filter === 'Patient') {
            navigate('/PatientResults');
        } else if (filter === 'Cancer Type' && value !== DEFAULT_CANCER_TYPE) {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        } else {
            setSearchQuery(DEFAULT_SUMMARY);
            setCancerType(DEFAULT_CANCER_TYPE);
        }
    }, [navigate, setSearchQuery, setCancerType]);

    const handleSunburstClick = useCallback((value: string | null) => {
        if (value) {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        }
        if (value === DEFAULT_CANCER_TYPE) {
            setSearchQuery(DEFAULT_SUMMARY);
        }
    }, [setSearchQuery, setCancerType]);

    return {
        handleSearch,
        handleSunburstClick,
    };
};