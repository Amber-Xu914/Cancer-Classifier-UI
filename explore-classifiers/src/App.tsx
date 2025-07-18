import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import MethylationClassifierProvider from './Components/MethylationClassifierProvider';
import NavBar from './Components/NavBar';
import PatientResults from './Components/PatientResults';
import zccTheme from './Themes/zccTheme';

function App() {
    return (
        <ThemeProvider theme={zccTheme}>
            <BrowserRouter>
                <MethylationClassifierProvider>
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
                </MethylationClassifierProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;

