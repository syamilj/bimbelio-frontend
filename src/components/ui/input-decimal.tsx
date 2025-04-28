import * as React from 'react';
import { Input } from './input';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    rawValue: string,
  ) => void;
}

const InputDecimal = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onValueChange, ...props }, ref) => (
    <Input
      ref={ref}
      type={'text'}
      value={
        props.value && (props.value as string)?.length > 0
          ? new Intl.NumberFormat('id-ID').format(
              parseInt((props.value as string)?.replace(/\D/g, '')),
            )
          : ''
      }
      onChange={(e) => {
        const rawValue = e.target.value.replace(/\./g, '');
        if (onValueChange) onValueChange(e, rawValue);
      }}
      {...props}
    />
  ),
);

InputDecimal.displayName = 'InputDecimal';

export { InputDecimal };
