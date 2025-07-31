import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DEFAULT_SUMMARY, DEFAULT_CANCER_TYPE } from "../Constants/DashboardDefaults";

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

export const useDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState(DEFAULT_SUMMARY);
    const [cancerType, setCancerType] = useState(DEFAULT_CANCER_TYPE);

    const resetDashboard = useCallback(() => {
        setSearchQuery(DEFAULT_SUMMARY);
        setCancerType(DEFAULT_CANCER_TYPE);
    }, []);

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
    }, [navigate]);

    const handleSunburstClick = useCallback((value: string | null) => {
        if (value) {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        }
        if (value === DEFAULT_CANCER_TYPE) {
            setSearchQuery(DEFAULT_SUMMARY);
        }
    }, []);

    return {
        // State
        searchQuery,
        cancerType,
        location,
        // Actions
        setSearchQuery,
        setCancerType,
        resetDashboard,
        handleSearch,
        handleSunburstClick,
    };
};