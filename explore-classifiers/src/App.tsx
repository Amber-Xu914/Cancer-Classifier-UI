import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import zccTheme from './Themes/zccTheme';
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import PatientResults from './Components/PatientResults';
import { DashboardContext } from './Contexts/DashboardContexts';
import { DEFAULT_SUMMARY } from './Constants/Common/DashboardDefaults';
import DashboardPage from './Components/DashboardPage';

function App() {
    const [searchQuery, setSearchQuery] = useState<string>(DEFAULT_SUMMARY);

    return (
        <ThemeProvider theme={zccTheme}>
            <BrowserRouter>
                <DashboardPage>
                    <div className="flex flex-col h-screen">
                        <NavBar />

                        <div className="flex-1 overflow-hidden">
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Navigate to="/dashboard" />}
                                />
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />
                                <Route path="/PatientResults" element={<PatientResults />} />
                            </Routes>
                        </div>
                    </div>
                </DashboardPage>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;

