import { keyframes, styled } from '@mui/material/styles';

interface IProps {
  colour?: string;
}

const dotFlashing = keyframes({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '0%': {
    opacity: 1,
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '50%, 100%': {
    opacity: 0.2,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Dot = styled('div')<IProps>(({
  theme,
  colour,
}) => ({
  position: 'relative',
  width: '4px',
  height: '4px',
  borderRadius: '2px',
  backgroundColor: colour || theme.colours.core.white,
  color: colour || theme.colours.core.white,
}));

// eslint-disable-next-line @typescript-eslint/naming-convention
const DotLeft = styled(Dot)({
  animation: `${dotFlashing} 1s infinite alternate`,
  animationDelay: '0s',
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DotCenter = styled(Dot)({
  animation: `${dotFlashing} 1s infinite linear alternate`,
  animationDelay: '0.5s',
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const DotRight = styled(Dot)({
  animation: `${dotFlashing} 1s infinite linear alternate`,
  animationDelay: '1s',
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Container = styled('div')({
  display: 'flex',
  gap: '3px',
});

export function FlashingDotsAnimation({
  colour,
}: IProps): React.ReactElement {
  return (
    <Container>
      <DotLeft colour={colour} />
      <DotCenter colour={colour} />
      <DotRight colour={colour} />
    </Container>
  );
}
