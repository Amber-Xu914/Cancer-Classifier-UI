import { useState } from 'react';
import FilterSelect from './Common/FilterSelect';
import TestingUmapPlot from './TestingUmapPlot';
import TestingSunBurstPlot from './TestingSunBurstPlot';
import TestingCNSSunburst from './TestingCNSSunburst';
import TestingCNSUMAP from './TestingCNSUmap';
import { DashboardContext } from '../Contexts/DashboardContexts';

interface DashboardProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function Dashboard({ searchQuery, setSearchQuery }: DashboardProps) {
  const handleSearch = (filter: string, value: string | null) => {
    if (filter === 'Cancer Type' && value?.toLowerCase().includes('cns')) {
      setSearchQuery('CNS');
    } else {
      setSearchQuery('default');
    }
  };

  return (
    <DashboardContext.Provider value={{ resetDashboard: () => setSearchQuery('default') }}>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1 style={{ marginBottom: '40px' }}>Methylation Classifier</h1>
        <FilterSelect onSearch={handleSearch} />
        <p style={{ marginTop: '40px', textAlign: 'center' }}>
          {searchQuery === 'CNS'
            ? 'Showing results for Central Nervous System (CNS)'
            : 'This summary page shows results from all classifications.'}
        </p>

        <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
          <div style={{ width: '50%' }}>
            <p>Testing Sunbust Chart</p>
            {searchQuery === 'CNS' ? <TestingCNSSunburst /> : <TestingSunBurstPlot />}
          </div>
          <div style={{ width: '50%' }}>
            <p>Testing UMAP</p>
            {searchQuery === 'CNS' ? <TestingCNSUMAP /> : <TestingUmapPlot />}
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

