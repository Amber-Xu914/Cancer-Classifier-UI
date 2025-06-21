import { Tabs as MuiTabs, Tab as MuiTab, TabsProps, TabProps, SxProps } from '@mui/material';
import { useState } from 'react';
import { corePalette } from '../../Themes/colours';
import CustomTypography from './Typography';

type TabVariant = 'navigation' | 'sub-navigation' | 'rectangle' | 'pill';
type TabSize = 'small' | 'medium' | 'large';
type IndicatorLocation = 'top' | 'bottom';
type Mode = 'light' | 'dark';
type Direction = 'column' | 'row';

interface IProps extends Omit<TabsProps, 'variant'> {
  variant: TabVariant;
  tabs: TabProps[];
  tabProps?: TabProps;
  size?: TabSize;
  indicatorLocation?: IndicatorLocation;
  tabGap?: string | number;
  mode?: Mode; // Currently affects 'navigation' variant only
  fullWidth?: boolean;
  direction?: Direction;
}

export function CustomTabs({
  variant,
  tabs,
  tabProps,
  size = 'medium',
  indicatorLocation = 'top',
  tabGap,
  mode = 'light',
  fullWidth = false,
  direction = 'row',
  ...props
}: IProps): React.ReactElement {
  const [tabValue, setTabValue] = useState<number>(0);

  const getSizeStyles = (): SxProps => {
    switch (size) {
      case 'small':
        return {
          height: '32px',
          minHeight: '32px',
        };
      case 'medium':
        return {
          height: '48px',
          minHeight: '48px',
        };
      case 'large':
      default:
        return {
          height: '64px',
          minHeight: '64px',
        };
    }
  };

  const getVariantStyles = (): SxProps => {
    const commonStyles: SxProps = {
      maxWidth: '100%',
      minWidth: 0,
      textTransform: 'none',
      flexGrow: fullWidth ? 1 : 0,
      transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
      '&.Mui-disabled': {
        color: `${corePalette.grey100}`,
      },
    };

    if (variant === 'rectangle') {
      return {
        ...commonStyles,
        backgroundColor: corePalette.grey10,
        color: corePalette.offBlack100,
        '&:hover': {
          backgroundColor: `${corePalette.grey30} !important`,
          '&.Mui-selected': {
            backgroundColor: `${corePalette.green30} !important`,
          },
        },
        '&.Mui-selected': {
          backgroundColor: `${corePalette.green10}`,
          color: `${corePalette.green300}`,
        },
      };
    }

    if (variant === 'pill') {
      return {
        ...commonStyles,
        borderRadius: '50px',
        backgroundColor: corePalette.blank,
        color: corePalette.offBlack100,
        '&:hover': {
          backgroundColor: `${corePalette.grey50} !important`,
          '&.Mui-selected': {
            backgroundColor: `${corePalette.green30} !important`,
          },
        },
        '&.Mui-selected': {
          backgroundColor: `${corePalette.green10}`,
          color: `${corePalette.green300}`,
        },
      };
    }

    if (variant === 'sub-navigation') {
      return {
        ...commonStyles,
        backgroundColor: corePalette.grey10,
        color: corePalette.offBlack100,
        borderBottom: `1px solid ${corePalette.grey50}`,
        borderLeft: `0.5px solid ${corePalette.grey50}`,
        borderRight: `0.5px solid ${corePalette.grey50}`,
        '&:hover': {
          backgroundColor: `${corePalette.grey30} !important`,
          '&.Mui-selected': {
            backgroundColor: `${corePalette.green30} !important`,
          },
        },
        '&.Mui-selected': {
          backgroundColor: `${corePalette.green10}`,
          color: `${corePalette.offBlack100}`,
        },
      };
    }

    // Specific styles for navigation variant in light/dark mode
    switch (mode) {
      case 'dark':
        return {
          ...commonStyles,
          color: corePalette.grey10,
          '&:hover': {
            backgroundColor: `${corePalette.grey200} !important`,
            '&.Mui-selected': {
              backgroundColor: `${corePalette.grey30} !important`,
            },
          },
          '&.Mui-selected': {
            backgroundColor: `${corePalette.grey10}`,
            color: `${corePalette.offBlack100}`,
          },
        };
      case 'light':
      default:
        return {
          ...commonStyles,
          backgroundColor: corePalette.white,
          color: corePalette.offBlack100,
          '&:hover': {
            backgroundColor: `${corePalette.grey30} !important`,
          },
          '&.Mui-selected': {
            backgroundColor: `${corePalette.grey10}`,
            color: `${corePalette.offBlack100}`,
          },
        };
    }
  };

  const getTabsStyles = (): SxProps => {
    const commonStyles: SxProps = {
      minHeight: 0,
      '& .MuiTabs-flexContainer': {
        gap: tabGap,
        flexDirection: direction,
      },
    };

    switch (variant) {
      case 'rectangle':
        return {
          ...commonStyles,
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          '& .MuiTabs-flexContainer > button': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          },
        };
      case 'pill':
        return {
          ...commonStyles,
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        };
      case 'navigation':
      case 'sub-navigation':
      default:
        return {
          ...commonStyles,
          '& .MuiTabs-indicator': {
            backgroundColor: corePalette.green100,
            height: '4px',
            bottom: indicatorLocation === 'bottom' ? 0 : undefined,
            top: indicatorLocation === 'top' ? 0 : undefined,
          },
        };
    }
  };

  return (
    <MuiTabs
      value={tabValue}
      onChange={(e, v): void => setTabValue(v)}
      sx={getTabsStyles()}
      {...props}
    >
      {tabs.map((tab) => (
        <MuiTab
          key={tab.value}
          value={tab.value}
          label={
            <CustomTypography variant="bodyRegular" truncate>
              {tab.label}
            </CustomTypography>
          }
          sx={
            {
              ...getSizeStyles(),
              ...getVariantStyles(),
            } as SxProps
          }
          {...tab}
          {...tabProps}
        />
      ))}
    </MuiTabs>
  );
}

export default CustomTabs;