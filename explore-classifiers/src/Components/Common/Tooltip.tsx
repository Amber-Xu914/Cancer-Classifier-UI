import { Tooltip as MuiTooltip, TooltipProps } from '@mui/material';
import { corePalette } from '../../Themes/colours';

export default function CustomTooltip({ children, ...props }: TooltipProps): React.ReactElement {
  return (
    <MuiTooltip
      {...props}
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: corePalette.offBlack100,
            color: corePalette.white,
            fontSize: '16px',
            verticalAlign: 'middle',
            padding: '8px 16px',
          },
        },
        arrow: {
          sx: {
            color: corePalette.offBlack100,
          },
        },
      }}
    >
      {children}
    </MuiTooltip>
  );
}
