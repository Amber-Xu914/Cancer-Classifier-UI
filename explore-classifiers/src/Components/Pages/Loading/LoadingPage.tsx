import { Box } from '@mui/material';
import LoadingAnimation from '../../Animations/LoadingAnimation';
import { corePalette } from '../../../Themes/colours';

export default function LoadingPage(): React.ReactElement {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
    >
      <LoadingAnimation
        baseColour={corePalette.offBlack100}
        dotColour={corePalette.offBlack100}
      />
    </Box>
  );
}
