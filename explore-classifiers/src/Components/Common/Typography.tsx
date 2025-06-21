import { Typography as MuiTypography, TypographyProps } from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';
import CustomTooltip from './Tooltip';

interface IProps extends TypographyProps {
  truncate?: boolean;
  tooltipText?: ReactNode;
}

export default function CustomTypography({
  truncate,
  tooltipText,
  className,
  ...props
}: IProps): React.ReactElement {
  const [hover, setHover] = useState<boolean>(false);
  const textElementRef = useRef<HTMLSpanElement | null>(null);

  const noWrap = truncate ?? false;

  useEffect(() => {
    function compareSize(): void {
      if (textElementRef.current) {
        const compare = textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
        setHover(compare);
      }
    }
    compareSize();
    window.addEventListener('mouseover', compareSize);

    return (): void => {
      window.removeEventListener('mouseover', compareSize);
    };
  }, []);

  return (
    <CustomTooltip
      title={tooltipText || props.children || ''}
      disableHoverListener={!tooltipText && (!hover || !noWrap)}
      placement="bottom"
      arrow
    >
      <MuiTypography
        ref={textElementRef}
        noWrap={noWrap}
        className={className}
        sx={{
          maxWidth: truncate ? '100%' : 'inherit',
        }}
        {...props}
      />
    </CustomTooltip>
  );
}
