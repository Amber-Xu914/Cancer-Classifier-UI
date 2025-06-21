import { corePalette } from '../../Themes/colours';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { CircleAlertIcon } from 'lucide-react';
import LabelledInputWrapper from './LabelledInputWrapper';

interface IProps extends OutlinedInputProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

export default function CustomOutlinedInput({
  label,
  helperText,
  error,
  errorMessage,
  multiline,
  ...props
}: IProps): React.ReactElement {
  return (
    <LabelledInputWrapper
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
    >
      <OutlinedInput
        id="custom-outlined-input"
        multiline={multiline}
        error={error}
        endAdornment={error && !props.endAdornment
          ? (
            <CircleAlertIcon
              fill={corePalette.red150}
              stroke={corePalette.white}
            />
          )
          : props.endAdornment}
        {...props}
      />
    </LabelledInputWrapper>
  );
}
