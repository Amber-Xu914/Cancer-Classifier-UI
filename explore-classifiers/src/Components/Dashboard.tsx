import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_CANCER_TYPE, DEFAULT_SUMMARY } from '../Constants/Common/DashboardDefaults';
import { useDashboard } from '../Contexts/DashboardContexts';
import LoadingAnimation from './Animations/LoadingAnimation';
import { CancerTypeData, getCancerHireachy } from '../Service/getCancerHireachyData';
import SunburstChart from './SunBurstPlot';
import Umap from './Umap';
import { useRef } from 'react';
import FilterSelect, { FilterSelectHandles } from './FilterSelect';


export default function Dashboard() {
    const navigate = useNavigate();
    const { resetDashboard } = useDashboard();
    const location = useLocation();
    const { searchQuery, setSearchQuery, cancerType, setCancerType } = useDashboard();
    const [cancerHireachyData, setCancerHireachyData] = useState<CancerTypeData[]>([]);
    const filterSelectRef = useRef<FilterSelectHandles>(null);

    useEffect(() => {
        getCancerHireachy()
            .then((data) => {
                setCancerHireachyData(data);
            })
            .catch(err => console.error(err));
    }, []);

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

        // clear search bar while clicking sunburst chart
        filterSelectRef.current?.clearInputs();

        if (value) {
            setSearchQuery(`Showing results for: ${value}`);
            setCancerType(value);
        }
        if (value === DEFAULT_CANCER_TYPE) {
            setSearchQuery(DEFAULT_SUMMARY);
        }
    }, [setSearchQuery, setCancerType]);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '40px' }}>
                Explore paediatric cancer types with sunburst chart and 3D UMAP visualizations.
            </h2>
            <FilterSelect
                ref={filterSelectRef}
                onSearch={handleSearch}
                data={cancerHireachyData}
            />
            <p style={{ marginTop: '40px', textAlign: 'center' }}>
                {searchQuery}
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                <div style={{ flex: 2 }}>
                    {cancerHireachyData.length > 0 ? (
                        <SunburstChart
                            data={cancerHireachyData}
                            onClick={handleSunburstClick}
                            level={cancerType}
                        />
                    ) : (
                        <LoadingAnimation />
                    )}
                </div>
                <div style={{ flex: 3 }}>
                    <Umap cancerType={cancerType} />
                </div>
            </div>
        </div>
    );
}
