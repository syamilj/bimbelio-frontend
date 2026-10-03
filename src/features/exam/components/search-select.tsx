'use client';

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
import { useId, useState } from 'react';

/** Pilihan bertelusur (kampus, jurusan) dengan label terlihat. */
export function SearchSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <span
        id={id}
        className="text-sm font-semibold"
      >
        {label}
      </span>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-labelledby={id}
            disabled={disabled}
            className={cn(
              'h-11 w-full justify-between rounded-sm border border-line-strong px-4 font-normal',
              !value && 'text-ink-muted',
            )}
          >
            <span className="truncate">{value || placeholder}</span>
            <ChevronsUpDown
              className="opacity-60"
              aria-hidden
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder={`Cari ${label.toLowerCase()}…`} />
            <CommandList>
              <CommandEmpty>Tidak ditemukan.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    <span className="flex-1">{option}</span>
                    <Check
                      className={cn(
                        'size-4',
                        value === option ? 'opacity-100' : 'opacity-0',
                      )}
                      aria-hidden
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
}
