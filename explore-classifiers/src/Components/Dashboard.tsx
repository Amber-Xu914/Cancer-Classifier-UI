import FilterSelect from './Common/FilterSelect';
import TestingUmapPlot from './TestingUmapPlot';
import TestingSunBurstPlot from './TestingSunBurstPlot';
import TestingCNSSunburst from './TestingCNSSunburst';
import TestingCNSUMAP from './TestingCNSUmap';
import { DashboardContext } from '../Contexts/DashboardContexts';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_SUMMARY } from '../Constants/Common/defaultSummaryText';

interface DashboardProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dashboard({ searchQuery, setSearchQuery }: DashboardProps) {
    const navigate = useNavigate();

    const handleSearch = (filter: string, value: string | null) => {
        if (!value) return;

        if (filter === 'Patient') {
            navigate('/PatientResults');
        } else if (filter === 'Cancer Type') {
            setSearchQuery(`Showing results for: ${value}`);
        } else {
            setSearchQuery(DEFAULT_SUMMARY);
        }
    };

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
                        {/* TODO: fetch from API to create and display the umap */}
                        <p>Testing UMAP</p>
                        {searchQuery === 'CNS' ? <TestingCNSUMAP /> : <TestingUmapPlot />}
                    </div>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}
