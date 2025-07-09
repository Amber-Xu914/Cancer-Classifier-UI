import FilterSelect from './Common/FilterSelect';
import TestingSunBurstPlot from './TestingSunBurstPlot';
import TestingCNSSunburst from './TestingCNSSunburst';
import Plot from 'react-plotly.js';
import { DashboardContext } from '../Contexts/DashboardContexts';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_SUMMARY } from '../Constants/Common/defaultSummaryText';
import { useEffect, useState } from 'react';
import LoadingAnimation from './Animations/LoadingAnimation';

interface DashboardProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dashboard({ searchQuery, setSearchQuery }: DashboardProps) {
    const navigate = useNavigate();
    const [cancerType, setCancerType] = useState('ZERO2');
    const [umap, setUmap] = useState<any>(null);

    const handleSearch = (filter: string, value: string | null) => {
        if (!value) return;

        if (filter === 'Patient') {
            navigate('/PatientResults');
        } else if (filter === 'Cancer Type') {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        } else {
            setSearchQuery(DEFAULT_SUMMARY);
            setCancerType('ZERO2');
        }
    };

    useEffect(() => {
        fetch(`/cancer_type/${cancerType}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(`Fetched UMAP for ${cancerType}:`, JSON.parse(data.plot), ` Through the link: /cancer_type/${cancerType}`);
                setUmap(JSON.parse(data.plot));
            })
            .catch((error) => {
                console.error('Error fetching UMAP: ', error);
            })
    }, [cancerType]);

    return (
        <DashboardContext.Provider value={{ resetDashboard: () => setSearchQuery(DEFAULT_SUMMARY) }}>
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
                        {searchQuery === 'CNS' ? <TestingCNSSunburst /> : <TestingSunBurstPlot />}
                    </div>
                    <div style={{ width: '50%' }}>
                        {umap ? (<Plot
                            data={umap.data}
                            layout={{
                                margin: { l: 0, r: 0, b: 0, t: 20 },
                                scene: {
                                    xaxis: { title: 'UMAP 1', zeroline: false },
                                    yaxis: { title: 'UMAP 2', zeroline: false },
                                    zaxis: { title: 'UMAP 3', zeroline: false }
                                },
                                legend: {
                                    x: 0.02,
                                    y: 0.98,
                                    bgcolor: 'rgba(255,255,255,0.5)',
                                    bordercolor: '#ccc',
                                    borderwidth: 1
                                },
                                height: 500
                            }}
                            style={{ width: '100%' }}
                        />) : (
                            <LoadingAnimation />
                        )
                        }
                    </div>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}
