import React, { useEffect, useState } from 'react';
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
    const [umap, setUmap] = useState<any>(null);
    // The file with all cancer types is called ZERO2, could probably abstract this later on
    const [cancerType, setCancerType] = useState('ZERO2');

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

    // Fetch UMAP data based on the selected cancer type
    // This is called when the cancerType state changes
    // The endpoint /cancer_type/{cancerType} returns a stringified JSON object with
    // 'plot' property containing the UMAP data in JSON format
    // The plot data is expected to be in the format compatible with Plotly.js
    useEffect(() => {
        fetch(`/cancer_type/${cancerType}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const plot = JSON.parse(data.plot);
                setUmap(plot);
            })
            .catch((error) => {
                console.error('Error fetching UMAP: ', error);
            })
    }, [cancerType]);

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
                        {/* TODO: fetch from API to create and display the sunburst chart */}
                        <p>Testing Sunbust Chart</p>
                        {<SunBurstPlot onSearch={handleSearch} />}
                    </div>
                    <div style={{ width: '50%' }}>
                        <Umap cancerType={cancerType} />
                    </div>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}
