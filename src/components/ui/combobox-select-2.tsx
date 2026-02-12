import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Input } from './input';

interface ComboboxOption {
  label: string;
  value: string;
}

const ComboboxSelect2 = ({
  heading,
  placeholder,
  value,
  setValue,
  onSearchChange,
  options,
  disabled = false,
  isUniversity = false,
  className,
  regularInput,
}: {
  heading?: string;
  placeholder?: string;
  value?: { value: string; label: string };
  setValue: (val: { value: string; label: string }) => void;
  onSearchChange?: (val: string) => void;
  options: ComboboxOption[];
  disabled?: boolean;
  isUniversity?: boolean;
  className?: string;
  regularInput?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-[.5rem]">
      {heading && (
        <p className="text-[.9rem]">
          {heading}
          <span className="text-red-600">*</span>
        </p>
      )}
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between rounded-3xl border border-main-gray-input px-4 py-[.5rem] text-left text-[.9rem] font-normal',
              !value && 'text-main-gray-disabled',
              disabled && 'opacity-50 cursor-not-allowed',
              className,
            )}
          >
            <span className={isUniversity ? 'line-clamp-1' : 'truncate'}>
              {value && value.label.length > 0 ? value.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            {regularInput ? (
              <Input
                placeholder={`Search...`}
                className="h-9 rounded-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                onChange={(e) =>
                  onSearchChange && onSearchChange(e.target.value)
                }
              />
            ) : (
              <CommandInput
                placeholder={`Search...`}
                className="h-9"
                onValueChange={onSearchChange}
              />
            )}
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setValue({ value: currentValue, label: option.label });
                      setOpen(false);
                    }}
                    className={isUniversity ? 'py-2' : ''}
                  >
                    <div className="w-full text-left">{option.label}</div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4 shrink-0',
                        value?.value === option.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export { ComboboxSelect2 };
