import { AppBar, Box, styled, Typography, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAVBAR_HEIGHT } from '../Constants/Common/Dimensions.constants';
import { useDashboard } from '../Contexts/DashboardContexts';
import { corePalette } from '../Themes/colours';
import CustomButton from './Common/Button';

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
    const theme = useTheme();

    const handleSummaryClick = () => {
        resetDashboard();
        navigate('/dashboard', { replace: true });
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
                <Typography
                    variant="titleRegular"
                    sx={{
                        color: theme.typography.titleRegular.color,
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: theme.typography.fontWeightBold,
                    }}
                >
                    Methylation Classification
                </Typography>
            </Box>

            <CustomButton
                label="Home"
                variant="bold"
                onClick={handleSummaryClick}
            />
        </NavBarWrapper>
    );
}
