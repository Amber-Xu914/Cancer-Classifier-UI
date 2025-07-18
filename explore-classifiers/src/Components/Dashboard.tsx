import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_CANCER_TYPE, DEFAULT_SUMMARY } from '../Constants/Common/DashboardDefaults';
import { DashboardContext, useDashboard } from '../Contexts/DashboardContexts';
import FilterSelect from './Common/FilterSelect';
import SunBurstPlot from './SunBurstPlot';
import Umap from './Umap';

interface DashboardProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dashboard({ searchQuery, setSearchQuery }: DashboardProps) {
    const navigate = useNavigate();
    const { resetDashboard } = useDashboard();
    const location = useLocation();
    const [cancerType, setCancerType] = useState(DEFAULT_CANCER_TYPE);

    useEffect(() => {
        if (location.pathname === '/dashboard' || location.pathname === '/') {
            resetDashboard();
        }
    }, [location.pathname]);

    // Handle search based on filter type
    // This function is called when the user clicks the search button in FilterSelect
    const handleSearch = (filter: string, value: string | null) => {
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
    };

    const handleSunburstClick = useCallback((value: string | null) => {
        if (value) {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        }
        if (value === DEFAULT_CANCER_TYPE) {
            setSearchQuery(DEFAULT_SUMMARY);
        }
    }, [setSearchQuery, setCancerType]);

    return (
        <DashboardContext.Provider value={{
            resetDashboard: () => {
                setSearchQuery(DEFAULT_SUMMARY);
                setCancerType(DEFAULT_CANCER_TYPE);
            }
        }}>
            <div style={{ padding: '20px', fontFamily: 'Arial' }}>
                <h1 style={{ marginBottom: '40px' }}>Methylation Classifier</h1>
                <FilterSelect onSearch={handleSearch} />
                <p style={{ marginTop: '40px', textAlign: 'center' }}>
                    {searchQuery}
                </p>

                <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
                    <div style={{ width: '50%' }}>
                        <SunBurstPlot onClick={handleSunburstClick} />
                    </div>
                    <div style={{ width: '50%' }}>
                        <Umap cancerType={cancerType} />
                    </div>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}
