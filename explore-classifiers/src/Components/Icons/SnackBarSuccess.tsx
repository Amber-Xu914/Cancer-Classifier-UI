import { SvgIcon, SvgIconProps } from '@mui/material';
import { corePalette } from '../../Themes/colours';

type IProps = {
  svgProps?: SvgIconProps;
};

function SnackBarSuccess({ svgProps }: IProps): React.ReactElement {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
      style={{ fill: 'none' }}
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill={corePalette.green150}
        stroke={corePalette.green10}
        strokeWidth="4"
      />
      <path
        d="M8 12.2535L10.5121 15L16 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export default SnackBarSuccess;
