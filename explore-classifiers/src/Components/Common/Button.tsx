import { Box, ButtonProps, Button as MuiButton, styled } from '@mui/material';
import { ReactNode } from 'react';
import { corePalette } from '../../Themes/colours';
import { FlashingDotsAnimation } from '../Animations/FlashingDotsAnimation';

const IconWrapper = styled('div')(() => ({
    width: '20px',
    height: '20px',
    '& > svg': {
        width: '20px',
        height: '20px',
    },
}));

interface IProps extends ButtonProps {
    label: ReactNode;
    loading?: boolean;
}

export default function CustomButton({
    label,
    startIcon,
    endIcon,
    loading = false,
    disabled = false,
    onClick,
    ...props
}: IProps): React.ReactElement {
    const getAnimationColour = (): string => {
        switch (props.variant) {
            case 'bold':
                return corePalette.white;
            case 'subtle':
                return corePalette.offBlack100;
            case 'outline':
                return corePalette.green150;
            case 'text':
                return corePalette.green150;
            case 'warning':
                return corePalette.red100;
            default:
                return corePalette.white;
        }
    };

    return (
        <MuiButton disabled={disabled} onClick={loading ? undefined : onClick} {...props}>
            {loading ? (
                <FlashingDotsAnimation colour={getAnimationColour()} />
            ) : (
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    columnGap="4px"
                    width="100%"
                >
                    {startIcon && <IconWrapper>{startIcon}</IconWrapper>}
                    <span>{label}</span>
                    {endIcon && <IconWrapper>{endIcon}</IconWrapper>}
                </Box>
            )}
        </MuiButton>
    );
}
