import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_CANCER_TYPE, DEFAULT_SUMMARY } from '../Constants/Common/DashboardDefaults';
import { useDashboard } from '../Contexts/DashboardContexts';
import FilterSelect from './Common/FilterSelect';
import SunburstChart from './SunBurstPlot';
import Umap from './Umap';

export default function Dashboard() {
    const navigate = useNavigate();
    const { resetDashboard } = useDashboard();
    const location = useLocation();
    const { searchQuery, setSearchQuery, cancerType, setCancerType } = useDashboard();

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
        console.log('Sunburst clicked with value:', value);
        if (value) {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        }
        if (value === DEFAULT_CANCER_TYPE) {
            setSearchQuery(DEFAULT_SUMMARY);
        }
    }, [setSearchQuery, setCancerType]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1 style={{ marginBottom: '40px' }}>Methylation Classifier</h1>
            <FilterSelect onSearch={handleSearch} />
            <p style={{ marginTop: '40px', textAlign: 'center' }}>
                {searchQuery}
            </p>
            <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
                <div style={{ width: '50%' }}>
                    <SunburstChart onClick={handleSunburstClick} />
                </div>
                <div style={{ width: '50%' }}>
                    <Umap cancerType={cancerType} />
                </div>
            </div>
        </div>
    );
}
