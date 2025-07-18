import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_SUMMARY } from '../Constants/Common/defaultSummaryText';
import { DashboardContext } from '../Contexts/DashboardContexts';
import LoadingAnimation from './Animations/LoadingAnimation';
import FilterSelect from './Common/FilterSelect';
import SunBurstPlot from './SunBurstPlot';
import Umap from './Umap';

interface DashboardProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dashboard({ searchQuery, setSearchQuery }: DashboardProps) {
    const navigate = useNavigate();
    // The file with all cancer types is called ZERO2, could probably abstract this later on
    const [cancerType, setCancerType] = useState('ZERO2');
    console.log('Dashboard rendered');
    // Handle search based on filter type
    // This function is called when the user clicks the search button in FilterSelect
    const handleSearch = (filter: string, value: string | null) => {
        if (!value) return;

        if (filter === 'Patient') {
            navigate('/PatientResults');
        } else if (filter === 'Cancer Type' && value !== 'ZERO2') {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        } else {
            setSearchQuery(DEFAULT_SUMMARY);
            setCancerType('ZERO2');
        }
    };

    const handleSunburstClick = useCallback((value: string | null) => {
        if (value) {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        }
        if (value === 'ZERO2') {
            setSearchQuery(DEFAULT_SUMMARY);
        }
    }, [setSearchQuery, setCancerType]);

    return (
        <DashboardContext.Provider value={{
            resetDashboard: () => {
                setSearchQuery(DEFAULT_SUMMARY);
                setCancerType('ZERO2');
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
