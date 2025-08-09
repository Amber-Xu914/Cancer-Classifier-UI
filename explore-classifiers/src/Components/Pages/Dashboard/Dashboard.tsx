import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDashboard } from '../../../Contexts';
import { useCancerHierarchy, useDashboardActions } from '../../../Hooks';
import LoadingAnimation from '../../Animations/LoadingAnimation';
import FilterSelect, { FilterSelectHandles } from '../../Forms/FilterSelect';
import SunBurstPlot from '../../Visualisation/SunBurstPlot';
import CancerUmap from '../../Visualisation/CancerUmap';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
    const location = useLocation();
    const { handleSearch, handleSunburstClick } = useDashboardActions();
    const { searchQuery, cancerType } = useDashboard();

    const { data: cancerHierarchyData, loading } = useCancerHierarchy();
    const filterSelectRef = useRef<FilterSelectHandles>(null);

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
                    <CancerUmap cancerType={cancerType} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;