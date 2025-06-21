import { corePalette } from '../../Themes/colours';
import { Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import CustomTypography from './Typography';

interface IProps {
  children: ReactNode;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  sx?: SxProps<Theme>;
}

export default function LabelledInputWrapper({
  children,
  label,
  helperText,
  errorMessage,
  sx,
}: IProps): React.ReactElement {
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={sx}
    >
      {label && (
        <CustomTypography variant="label">
          {label}
        </CustomTypography>
      )}
      {helperText && (
        <CustomTypography
          variant="bodySmall"
          color={corePalette.grey100}
        >
          {helperText}
        </CustomTypography>
      )}
      {children}
      {errorMessage && (
        <CustomTypography
          variant="label"
          color={corePalette.red200}
        >
          {errorMessage}
        </CustomTypography>
      )}
    </Box>
  );
}
