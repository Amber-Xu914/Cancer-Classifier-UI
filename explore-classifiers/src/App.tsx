import { ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './Components/Pages/Dashboard/Dashboard';
import zccTheme from './Themes/zccTheme';
import NavBar from './Components/NavBar';
import { MethylationClassifierProvider } from './Contexts';
import PatientResults from './Components/Pages/Patients/PatientResults';

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
