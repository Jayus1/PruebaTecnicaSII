import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
}

export const CustomTextField = ({ label, ...props }: CustomTextFieldProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: '#f8f9fa',
          '& fieldset': {
            borderColor: '#e0e0e0',
          },
          '&:hover fieldset': {
            borderColor: '#c0c0c0',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#5b4bdb',
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 600,
          color: '#000',
          '&.Mui-focused': {
            color: '#5b4bdb',
          },
        },
      }}
      {...props}
    />
  );
};
