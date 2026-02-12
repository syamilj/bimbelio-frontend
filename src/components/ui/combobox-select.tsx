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

interface ComboboxOption {
  label: string;
  value: string;
}

const ComboboxSelect = ({
  heading,
  placeholder,
  value,
  setValue,
  options,
  disabled = false,
  isUniversity = false,
  className,
}: {
  heading?: string;
  placeholder?: string;
  value?: string;
  setValue: (val: string) => void;
  options: ComboboxOption[];
  disabled?: boolean;
  isUniversity?: boolean;
  className?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  if (!heading) {
    return (
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
              {value
                ? options.find((option) => option.value === value)?.label ||
                  value
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${heading?.toLowerCase()}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      setOpen(false);
                    }}
                    className={isUniversity ? 'py-2' : ''}
                  >
                    <div className="w-full text-left">{option.label}</div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4 shrink-0',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex flex-col gap-[.5rem]">
      <p className="text-[.9rem]">
        {heading}
        <span className="text-red-600">*</span>
      </p>
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
            )}
          >
            <span className={isUniversity ? 'line-clamp-1' : 'truncate'}>
              {value
                ? options.find((option) => option.value === value)?.label ||
                  value
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${heading?.toLowerCase()}...`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      setOpen(false);
                    }}
                    className={isUniversity ? 'py-2' : ''}
                  >
                    <div className="w-full text-left">{option.label}</div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4 shrink-0',
                        value === option.value ? 'opacity-100' : 'opacity-0',
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
export { ComboboxSelect };
