import { AppBar, Box, Button, styled } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { CustomTabs } from './Common/Tabs';
import { NAVBAR_HEIGHT } from '../Constants/Common/Dimensions.constants';
import zccTheme from '../Themes/zccTheme';

const NavBarWrapper = styled(AppBar)(({ theme }) => ({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100vw',
  height: NAVBAR_HEIGHT,
  boxShadow: 'none',
  backgroundColor: theme.colours.core.grey30,
  padding: '0 24px',
}));

export default function NavBar() {
  const location = useLocation();

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
        <span style={{ color: 'black', fontWeight: 'bold' }}>Paediatric Cancer Classification</span>

        {location.pathname.includes('dashboard') && (
          <Box marginLeft="40px">
            <CustomTabs
              value={'home'}
              onChange={() => {}}
              variant="navigation"
              size="large"
              mode="dark"
              tabs={[{ label: 'Home', value: 'home' }]}
            />
          </Box>
        )}
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <Button
          sx={{
            backgroundColor: zccTheme.colours.core.yellow100,
            color: zccTheme.colours.core.offBlack200,
            borderRadius: '50px',
            padding: '6px 24px',
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: zccTheme.colours.core.yellow150,
              boxShadow: 'none',
            },
          }}
        >
          Summary
        </Button>
      </Box>
    </NavBarWrapper>
  );
}
