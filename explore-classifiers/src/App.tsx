import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import zccTheme from './Themes/zccTheme';
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import PatientResults from './Components/PatientResults';
import { DashboardContext } from './Contexts/DashboardContexts';

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('default');

  return (
    <ThemeProvider theme={zccTheme}>
      <BrowserRouter>
        <DashboardContext.Provider value={{ resetDashboard: () => setSearchQuery('default') }}>
          <div className="flex flex-col h-screen">
            <NavBar />

            <div className="flex-1 overflow-hidden">
              <Routes>
                <Route
                  path="/"
                  element={<Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
                />
                <Route
                  path="/dashboard"
                  element={<Dashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
                />
                <Route path="/PatientResults" element={<PatientResults />} />
              </Routes>
            </div>
          </div>
        </DashboardContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

