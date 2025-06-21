import { SvgIcon, SvgIconProps } from '@mui/material';
import { corePalette } from '../../Themes/colours';

type IProps = {
  svgProps?: SvgIconProps;
};

function SnackBarWarning({ svgProps }: IProps): React.ReactElement {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
      style={{ fill: 'none' }}
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill={corePalette.orange150}
        stroke={corePalette.orange30}
        strokeWidth="4"
      />
      <path
        d="M12 13L12 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="16" r="1" fill="white" />
    </SvgIcon>
  );
}

export default SnackBarWarning;
