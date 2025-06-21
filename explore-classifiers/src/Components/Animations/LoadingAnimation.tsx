import { ReactNode } from 'react';
import { keyframes, styled } from '@mui/material/styles';

interface IProps {
  msg?: ReactNode;
  dotColour?: string;
  baseColour?: string;
}

const spin = keyframes({
  '0%': {
    transform: 'translateY(0px) scale(1)',
  },
  '25%': {
    transform: 'translateY(30px) scale(2)',
  },
  '50%': {
    transform: 'translateY(60px) scale(1)',
  },
  '75%': {
    transform: 'translateY(30px) scale(0.3)',
  },
  '100%': {
    transform: 'translateY(0px) scale(1)',
  },
});

const flex = keyframes({
  '0%': {
    transform: 'scaleY(5)',
  },
  '25%': {
    transform: 'scaleY(1)',
  },
  '50%': {
    transform: 'scaleY(5)',
  },
  '75%': {
    transform: 'scaleY(1)',
  },
  '100%': {
    transform: 'scaleY(5)',
  },
});

const Container = styled('div')({
  width: '100%',
  height: '100%',
});

const AnimationWrapper = styled('div')({
  position: 'relative',
  width: '128px',
  height: '70px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
});

const MessageWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: 'fit-content',
  top: 'calc(50% + 80px)',
  left: '50%',
  color: theme.colours.core.grey100,
  transform: 'translate(-50%, -50%)',
}));

const Dot = styled('div')<IProps>(({
  theme,
  dotColour,
}) => ({
  position: 'absolute',
  width: '10px',
  height: '10px',
  borderRadius: '5px',
  background: dotColour || theme.colours.core.offBlack100,
  animation: `${spin} 1.5s linear infinite`,
  transformOrigin: 'center center',
  zIndex: 10,
}));

const Base = styled('div')<IProps>(({
  theme,
  baseColour,
}) => ({
  position: 'absolute',
  width: '1px',
  height: '10px',
  top: '30px',
  background: baseColour || theme.colours.core.offBlack100,
  animation: `${flex} 1.5s linear infinite`,
  transformOrigin: 'center center',
}));

const dots = [
  {
    animation: `${spin} 1.5s linear infinite`,
  },
  {
    animation: `${spin} 1.5s -0.75s linear infinite`,
  },
  {
    left: '30px',
    animation: `${spin} 1.5s -1.3s linear infinite`,
  },
  {
    left: '30px',
    animation: `${spin} 1.5s -0.55s linear infinite`,
  },
  {
    left: '60px',
    animation: `${spin} 1.5s -1.1s linear infinite`,
  },
  {
    left: '60px',
    animation: `${spin} 1.5s -0.35s linear infinite`,
  },
  {
    left: '90px',
    animation: `${spin} 1.5s -0.9s linear infinite`,
  },
  {
    left: '90px',
    animation: `${spin} 1.5s -0.15s linear infinite`,
  },
  {
    left: '120px',
    animation: `${spin} 1.5s -0.7s linear infinite`,
  },
  {
    left: '120px',
    animation: `${spin} 1.5s 0.05s linear infinite`,
  },
];

const bases = [
  {
    left: '5px',
    animation: `${flex} 1.5s linear infinite`,
  },
  {
    left: '35px',
    animation: `${flex} 1.5s -1.3s linear infinite`,
  },
  {
    left: '65px',
    animation: `${flex} 1.5s -1.1s linear infinite`,
  },
  {
    left: '95px',
    animation: `${flex} 1.5s -0.9s linear infinite`,
  },
  {
    left: '125px',
    animation: `${flex} 1.5s -0.75s linear infinite`,
  },
];

const animatedDots = dots.map((d) => styled(Dot)({
  left: d.left,
  animation: d.animation,
}));

const animatedBases = bases.map((d) => styled(Base)({
  left: d.left,
  animation: d.animation,
}));

export default function LoadingAnimation({
  msg,
  dotColour,
  baseColour,
}: IProps): React.ReactElement {
  return (
    <Container>
      <AnimationWrapper>
        {animatedDots.map((StyledDot) => (
          <StyledDot
            dotColour={dotColour}
          />
        ))}
        {animatedBases.map((StyledBase) => (
          <StyledBase
            baseColour={baseColour}
          />
        ))}
        {msg && (
          <MessageWrapper>
            {msg}
          </MessageWrapper>
        )}
      </AnimationWrapper>
    </Container>
  );
}
