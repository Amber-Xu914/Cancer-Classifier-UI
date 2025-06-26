import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import zccTheme from './Themes/zccTheme';
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import { DashboardContext } from './Contexts/DashboardContexts';

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('default');

  return (
    <ThemeProvider theme={zccTheme}>
      <DashboardContext.Provider value={{ resetDashboard: () => setSearchQuery('default') }}>
        <div className="App">
          <NavBar />
          <Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </DashboardContext.Provider>
    </ThemeProvider>
  );
}

export default App;
