import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
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
    const theme = useTheme();

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
        <div style={{ padding: '20px', fontFamily: theme.typography.fontFamily }}>
            <Typography
                variant="h1"
                sx={{
                    marginBottom: '40px',
                    color: theme.typography.h1.color,
                    fontFamily: theme.typography.fontFamily,
                }}
            >
                Explore Paediatric Cancer Classifications Across Models and Visualizations.
            </Typography>
            <FilterSelect onSearch={handleSearch} />
            <Typography
                variant="bodyRegular"
                sx={{
                    marginTop: '40px',
                    textAlign: 'center',
                    color: theme.typography.bodyRegular.color,
                    fontFamily: theme.typography.fontFamily,
                    width: '100%',
                    display: 'block',
                }}
            >
                {searchQuery}
            </Typography>
            <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
                <div style={{ width: '50%' }}>
                    <SunburstChart
                        onClick={handleSunburstClick}
                        selectedCancerType={cancerType}
                    />
                </div>
                <div style={{ width: '50%' }}>
                    <Umap cancerType={cancerType} />
                </div>
            </div>
        </div>
    );
}
