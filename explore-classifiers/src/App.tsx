import './App.css';
import React from 'react';
import NavBar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import { ThemeProvider } from '@mui/material/styles';
import zccTheme from './Themes/zccTheme';

function App() {
  return (
    <ThemeProvider theme={zccTheme}>
      <div className="App">
        <NavBar />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;

