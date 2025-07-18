import { AppBar, Box, styled } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomTabs } from './Common/Tabs';
import CustomButton from './Common/Button';
import { NAVBAR_HEIGHT } from '../Constants/Common/Dimensions.constants';
import { useDashboard } from '../Contexts/DashboardContexts';
import { corePalette } from '../Themes/colours';

const NavBarWrapper = styled(AppBar)(() => ({
    position: 'sticky',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100vw',
    height: NAVBAR_HEIGHT,
    boxShadow: 'none',
    backgroundColor: corePalette.grey30,
    padding: '0 24px',
}));

export default function NavBar() {
    const { resetDashboard } = useDashboard();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSummaryClick = () => {
        navigate('/dashboard');
        resetDashboard();
    };

    return (
        <NavBarWrapper>
            <Box display="flex" alignItems="center">
                <img
                    src="/cci-logo.jpg"
                    alt="CCI Logo"
                    style={{
                        height: '40px',
                        width: '40px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginRight: '16px',
                    }}
                />
                <span style={{ color: 'black', fontWeight: 'bold' }}>
                    Paediatric Cancer Classification
                </span>
            </Box>

            <CustomButton
                label="Summary"
                variant="bold"
                onClick={handleSummaryClick}
            />
        </NavBarWrapper>
    );
}
