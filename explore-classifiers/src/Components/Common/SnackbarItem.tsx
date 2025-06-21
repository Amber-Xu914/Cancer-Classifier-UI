import { styled } from '@mui/material/styles';
import { MaterialDesignContent } from 'notistack';

// eslint-disable-next-line @typescript-eslint/naming-convention
const SnackbarItem = styled(MaterialDesignContent)(({ theme }) => ({
  minHeight: '56px',
  height: '100%',
  maxWidth: '500px',
  borderRadius: '8px',
  color: theme.colours.core.white,
  backgroundColor: `${theme.colours.core.offBlack200} !important`,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '& .MuiSvgIcon-root': {
    marginRight: '16px',
  },
}));

export default SnackbarItem;
