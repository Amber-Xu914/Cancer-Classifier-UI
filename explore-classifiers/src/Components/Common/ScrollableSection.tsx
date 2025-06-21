/* eslint-disable @typescript-eslint/naming-convention */
import { styled } from '@mui/material';
import SimpleBar, { Props as ISimpleBarProps } from 'simplebar-react';
import { CSSProperties, ReactNode } from 'react';

interface IScrollableSectionProps extends ISimpleBarProps {
  style?: CSSProperties;
  children?: ReactNode;
}

const CustomSimpleBar = styled(SimpleBar)<IScrollableSectionProps>(({ theme, style }) => ({
  '&::-webkit-scrollbar': {
    '-webkit-appearance': 'none',
    '&:vertical': {
      width: '11px',
    },
    '&:horizontal': {
      height: '11px',
    },
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '8px',
    border: `2px solid ${theme.colours.core.white}`,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    color: 'green',
  },
  ...style,
}));

export function ScrollableSection({
  children,
  style,
  ...rest
}: IScrollableSectionProps): React.ReactElement {
  return (
    <CustomSimpleBar style={style} {...rest}>
      {children}
    </CustomSimpleBar>
  );
}
