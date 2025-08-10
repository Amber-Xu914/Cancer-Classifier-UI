import { ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './Components/Common/NavBar';
import Dashboard from './Components/Pages/Dashboard/Dashboard';
import PatientResults from './Components/Pages/Patients/PatientResults';
import { MethylationClassifierProvider } from './Contexts';
import zccTheme from './Themes/zccTheme';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/PatientResults" element={<PatientResults />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <ThemeProvider theme={zccTheme}>
            <BrowserRouter>
                <MethylationClassifierProvider>
                    <div className="flex flex-col h-screen">
                        <NavBar />
                        <div className="flex-1 overflow-hidden">
                            <AnimatedRoutes />
                        </div>
                    </div>
                </MethylationClassifierProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
