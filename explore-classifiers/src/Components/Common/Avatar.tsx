import {
  Avatar as MuiAvatar,
  AvatarProps,
  Badge as MuiBadge,
  styled,
  BadgeProps,
} from '@mui/material';
import { PlusIcon } from 'lucide-react';
import { CSSProperties, useEffect, useState } from 'react';
import { corePalette } from '../../Themes/colours';
import { IUser } from '../../Types/User/User.types';
import CustomTypography from './Typography';
import { getInitials } from '../../Utils/Misc/strings';

type SizeVariant = 'small' | 'medium' | 'large';

interface IAvatarProps extends AvatarProps {
  size?: SizeVariant;
  background?: string;
  colour?: string;
  border?: string;
}

const mapSizes = (size: SizeVariant): CSSProperties => {
  switch (size) {
    case 'small':
      return {
        width: '36px',
        height: '36px',
        fontSize: '14px',
      };
    case 'medium':
      return {
        width: '44px',
        height: '44px',
        fontSize: '14px',
      };
    case 'large':
      return {
        width: '64px',
        height: '64px',
        fontSize: '20px',
      };
    default:
      return {
        width: '36px',
        height: '36px',
        fontSize: '14px',
      };
  }
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const Avatar = styled(MuiAvatar)<IAvatarProps>(
  ({ theme, size = 'small', background, colour, border }) => ({
    backgroundColor: background || theme.colours.core.grey30,
    color: colour || theme.colours.core.offBlack100,
    border: border || `1px solid ${theme.colours.core.grey50}`,
    ...mapSizes(size),
  })
);

interface IProps extends AvatarProps {
  user?: IUser | null;
  size?: SizeVariant;
  avatarContent?: React.ReactElement;
  badgeText?: string;
  borderStyle?: 'dashed' | 'solid';
  iconColour?: string;
  defaultBackgroundColour?: string;
  badgeContent?: React.ReactElement;
  badgeProps?: BadgeProps;
}

export function CustomAvatar({
  user,
  size = 'small',
  avatarContent,
  badgeText = '',
  badgeContent,
  borderStyle = 'solid',
  iconColour = corePalette.offBlack100,
  defaultBackgroundColour = corePalette.white,
  badgeProps,
  ...props
}: IProps): React.ReactElement {
  const [url, setUrl] = useState<string>();

  // The below regex extracts the hex values of the user's avatar.
  // Searches for at least 2 hex values and at most 3, to accommodate
  // for both old and new formats. The delimiter is different too, so
  // the split accounts for that as well.
  // Old format: '#FFFFFF,#FFFFFF'
  // New format: 'colour:#FFFFFF;#FFFFFF;#FFFFFF'
  const getAvatarStyles = (): Record<string, unknown> => {
    if (
      user &&
      (user.avatar?.includes('colour') || user.avatar?.match(/([,;]*#[0-9A-Z]{6}){2,3}/))
    ) {
      const [background, border, color] = user.avatar.replace('colour:', '').split(/[,;]/);

      return {
        background,
        border: `1px ${borderStyle} ${border}`,
        color: color || corePalette.offBlack100,
      };
    }

    // Default styling
    return {
      background: defaultBackgroundColour,
      border: `1px ${borderStyle || 'dashed'} ${corePalette.grey50}`,
      color: corePalette.offBlack100,
    };
  };

  const getAvatarContent = (): React.ReactElement => {
    if (avatarContent) return avatarContent;

    if (!user) {
      return <PlusIcon color={iconColour} />;
    }

    return (
      <CustomTypography variant="bodySmall" fontWeight="medium" fontSize="inherit">
        {getInitials(`${user.givenName} ${user.familyName}`)}
      </CustomTypography>
    );
  };

  useEffect(() => {
    if (user && user.avatar?.includes('url')) {
      setUrl(user.avatar.split(';')[1]);
    }
  }, [user]);

  return (
    <MuiBadge
      classes={{
        anchorOriginBottomRight: `
          right: 5px;
          bottom: 5px;
          transform: scale(1) translate(50%, 50%);
          transform-origin: 100% 100%;
        `,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={
        badgeContent ||
        (badgeText !== '' && (
          <CustomTypography variant="bodySmall" fontSize="10px">
            {badgeText}
          </CustomTypography>
        ))
      }
      {...badgeProps}
    >
      <Avatar src={url} size={size} {...getAvatarStyles()} {...props}>
        {getAvatarContent()}
      </Avatar>
    </MuiBadge>
  );
}
