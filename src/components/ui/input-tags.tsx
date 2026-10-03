import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

type InputTagsProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string[];
  onChange: (value: string[]) => void;
  emptyText?: string;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, emptyText = 'No data added yet', ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState('');

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint('');
      }
    };

    return (
      <>
        <div className="flex">
          <Input
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addPendingDataPoint();
              }
              //   else if (e.key === ',' || e.key === ' ') {
              //     e.preventDefault();
              //     addPendingDataPoint();
              //   }
            }}
            className="rounded-r-none ring-0 outline-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            {...props}
            ref={ref}
          />
          <Button
            type="button"
            variant="secondary"
            className="rounded-l-none border border-l-0 hover:bg-gray-200"
            onClick={addPendingDataPoint}
          >
            Add
          </Button>
        </div>
        <div className="flex min-h-[2.5rem] flex-wrap items-center gap-2 overflow-y-auto rounded-sm border p-2">
          {value.length === 0 && (
            <span className="flex w-full justify-center text-xs text-muted-foreground">
              {emptyText}
            </span>
          )}
          {value.map((item, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="flex items-center justify-between gap-1 border border-gray-200 pb-1"
            >
              {item}
              <button
                type="button"
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-gray-300"
                onClick={() => {
                  onChange(value.filter((i) => i !== item));
                }}
              >
                <XIcon className="w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </>
    );
  },
);

InputTags.displayName = 'InputTags';
