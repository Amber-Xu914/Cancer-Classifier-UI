import { Box } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useSnackbar } from 'notistack';
import { loginRequest } from '../../../Auth/Config/authConfig';
import CustomTypography from '../../Common/Typography';
import CustomButton from '../../Common/Button';

export default function LoginPage(): React.ReactElement {
  const location = useLocation();
  const { instance } = useMsal();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      await instance.loginRedirect({
        ...loginRequest,
        // NOTE - Change this string to reroute to a different path after logging in
        redirectStartPage: location?.state?.from?.pathname ?? '/dashboard',
      });
    } catch (err) {
      enqueueSnackbar('Could not login, please try again', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
    >
      <CustomTypography variant="h1" style={{ marginBottom: '100px' }}>
        Application Title
      </CustomTypography>
      <CustomButton
        variant="bold"
        size="medium"
        loading={loading}
        label="Login with CCIA"
        onClick={handleLogin}
      />
    </Box>
  );
}
