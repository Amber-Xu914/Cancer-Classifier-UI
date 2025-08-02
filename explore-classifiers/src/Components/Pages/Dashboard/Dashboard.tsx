import { useEffect, useRef } from 'react';
import { useCancerHierarchy, useDashboard } from '../../../Hooks';
import LoadingAnimation from '../../Animations/LoadingAnimation';
import FilterSelect, { FilterSelectHandles } from '../../Forms/FilterSelect';
import Umap from '../../Visualisation/Umap';
import styles from './Dashboard.module.css';
import SunBurstPlot from '../../Visualisation/SunBurstPlot';

const Dashboard: React.FC = () => {
    const {
        searchQuery,
        cancerType,
        location,
        resetDashboard,
        handleSearch,
        handleSunburstClick,
    } = useDashboard();

    const { data: cancerHierarchyData, loading } = useCancerHierarchy();
    const filterSelectRef = useRef<FilterSelectHandles>(null);

    // Reset dashboard when navigating to dashboard route
    useEffect(() => {
        if (location.pathname === '/dashboard' || location.pathname === '/') {
            resetDashboard();
        }
    }, [location.pathname, resetDashboard]);

    const handleSunburstClickWithClear = (value: string | null) => {
        // Clear search bar when clicking sunburst chart
        filterSelectRef.current?.clearInputs();
        handleSunburstClick(value);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>
                    Explore paediatric cancer types with sunburst chart and 3D UMAP visualizations.
                </h2>
            </header>

            <section className={styles.filterSection}>
                <FilterSelect
                    ref={filterSelectRef}
                    onSearch={handleSearch}
                    data={cancerHierarchyData}
                />

                <p className={styles.searchQuery}>
                    {searchQuery}
                </p>
            </section>

            <main className={styles.visualizationContainer}>
                <div className={styles.sunburstSection}>
                    {loading ? (
                        <LoadingAnimation />
                    ) : (
                        <SunBurstPlot
                            data={cancerHierarchyData}
                            onClick={handleSunburstClickWithClear}
                            level={cancerType}
                        />
                    )}
                </div>

                <div className={styles.umapSection}>
                    <Umap cancerType={cancerType} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;