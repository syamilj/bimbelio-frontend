'use client';

import { Badge } from '@/components/ui/badge';
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { fieldClassName, Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Check,
  ChevronsUpDown,
  ImageUp,
  LoaderCircle,
  Trash2,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useId, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  storagePublicUrl,
  useStorageUpload,
  type StorageBucket,
} from '../hooks/use-storage-upload';

export type Option = { value: string; label: string; description?: string };

type BaseFieldProps = {
  name: string;
  label: string;
  description?: React.ReactNode;
  /** Tandai "(opsional)" di label. */
  optional?: boolean;
  disabled?: boolean;
  className?: string;
};

function FieldLabel({
  label,
  optional,
}: {
  label: string;
  optional?: boolean;
}) {
  return (
    <FormLabel>
      {label}
      {optional && (
        <span className="ml-1 font-normal text-ink-subtle">(opsional)</span>
      )}
    </FormLabel>
  );
}

export function TextField({
  name,
  label,
  description,
  optional,
  disabled,
  className,
  placeholder,
  type = 'text',
  mono,
  autoComplete,
}: BaseFieldProps & {
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'tel' | 'password';
  mono?: boolean;
  autoComplete?: string;
}) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              className={cn(mono && 'font-mono')}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextareaField({
  name,
  label,
  description,
  optional,
  disabled,
  className,
  placeholder,
  rows = 3,
}: BaseFieldProps & { placeholder?: string; rows?: number }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <FormControl>
            <Textarea
              {...field}
              value={field.value ?? ''}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Angka: string kosong disimpan sebagai `undefined` agar zod bisa menolak/menerima. */
export function NumberField({
  name,
  label,
  description,
  optional,
  disabled,
  className,
  placeholder,
  min,
  max,
  step,
  suffix,
}: BaseFieldProps & {
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  /** Satuan di kanan, mis. "menit". */
  suffix?: string;
}) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <div className="relative">
            <FormControl>
              <Input
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                type="number"
                inputMode="decimal"
                value={
                  field.value === undefined ||
                  field.value === null ||
                  Number.isNaN(field.value)
                    ? ''
                    : field.value
                }
                onChange={(e) =>
                  field.onChange(
                    e.target.value === '' ? undefined : e.target.valueAsNumber,
                  )
                }
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className={cn('font-mono tabular-nums', suffix && 'pr-16')}
              />
            </FormControl>
            {suffix && (
              <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-ink-subtle">
                {suffix}
              </span>
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SelectField({
  name,
  label,
  description,
  optional,
  disabled,
  className,
  options,
  placeholder = 'Pilih salah satu',
}: BaseFieldProps & { options: Option[]; placeholder?: string }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                ref={field.ref}
                onBlur={field.onBlur}
                className="h-11"
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type ComboboxProps = {
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Pencarian di server: matikan filter lokal dan teruskan kata kunci. */
  onSearchChange?: (q: string) => void;
  loading?: boolean;
  /** Label untuk nilai terpilih yang belum ada di `options` (mis. data awal). */
  selectedLabel?: string;
  /** Boleh mengosongkan pilihan dengan memilih item yang sama lagi. */
  clearable?: boolean;
};

/** Kontrol combobox mandiri (tanpa react-hook-form), dipakai juga di luar ResourceForm. */
export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Pilih…',
  searchPlaceholder = 'Cari…',
  emptyText = 'Tidak ada yang cocok.',
  onSearchChange,
  loading,
  selectedLabel,
  clearable = true,
  disabled,
  id,
  invalid,
  'aria-label': ariaLabel,
  'aria-describedby': describedBy,
}: ComboboxProps & {
  value: string | null | undefined;
  onChange: (value: string | null, option?: Option) => void;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  const label = current?.label ?? (value ? selectedLabel : undefined);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          className={cn(
            fieldClassName,
            'flex h-11 items-center justify-between gap-2 px-3.5 text-left',
            !label && 'text-ink-subtle',
          )}
        >
          <span className="truncate">{label ?? placeholder}</span>
          <ChevronsUpDown
            className="size-4 shrink-0 text-ink-muted"
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-64 p-0"
        align="start"
      >
        <Command shouldFilter={!onSearchChange}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onSearchChange}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-ink-muted">
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden
                />
                Memuat…
              </div>
            ) : (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
            <CommandGroup>
              {options.map((opt) => {
                const selected = opt.value === value;
                return (
                  <CommandItem
                    key={opt.value}
                    value={`${opt.label} ${opt.value}`}
                    onSelect={() => {
                      onChange(selected && clearable ? null : opt.value, opt);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'size-4',
                        selected ? 'opacity-100' : 'opacity-0',
                      )}
                      aria-hidden
                    />
                    <span className="flex flex-col">
                      {opt.label}
                      {opt.description && (
                        <span className="text-xs text-ink-subtle">
                          {opt.description}
                        </span>
                      )}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ComboboxField({
  name,
  label,
  description,
  optional,
  disabled,
  className,
  onSelectOption,
  ...combo
}: BaseFieldProps &
  ComboboxProps & {
    /** Dipanggil setelah nilai berubah (mis. mengisi field lain). */
    onSelectOption?: (option: Option | null) => void;
  }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <FormControl>
            <Combobox
              {...combo}
              value={field.value}
              disabled={disabled}
              invalid={!!fieldState.error}
              onChange={(value, option) => {
                field.onChange(value);
                field.onBlur();
                onSelectOption?.(value ? (option ?? null) : null);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Kontrol pilih-banyak mandiri; nilai berupa array id. */
export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = 'Pilih…',
  searchPlaceholder = 'Cari…',
  emptyText = 'Tidak ada yang cocok.',
  disabled,
  id,
  invalid,
  disabledValues,
  'aria-label': ariaLabel,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  /** Opsi yang tampil tetapi tidak bisa dipilih/dilepas. */
  disabledValues?: string[];
  'aria-label'?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.filter((o) => value.includes(o.value));
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className="flex flex-col gap-2">
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabel}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            className={cn(
              fieldClassName,
              'flex h-11 items-center justify-between gap-2 px-3.5 text-left',
              selected.length === 0 && 'text-ink-subtle',
            )}
          >
            <span className="truncate">
              {selected.length === 0
                ? placeholder
                : `${selected.length} dipilih`}
            </span>
            <ChevronsUpDown
              className="size-4 shrink-0 text-ink-muted"
              aria-hidden
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) min-w-64 p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <CommandItem
                      key={opt.value}
                      value={`${opt.label} ${opt.value}`}
                      disabled={disabledValues?.includes(opt.value)}
                      onSelect={() => toggle(opt.value)}
                      aria-selected={isSelected}
                    >
                      <span
                        className={cn(
                          'flex size-4 items-center justify-center rounded-xs border border-line-strong',
                          isSelected && 'border-brand bg-brand text-brand-ink',
                        )}
                        aria-hidden
                      >
                        {isSelected && <Check className="size-3" />}
                      </span>
                      {opt.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <ul
          className="flex flex-wrap gap-1.5"
          aria-label="Pilihan"
        >
          {selected.map((opt) => (
            <li key={opt.value}>
              <Badge
                variant="secondary"
                className="gap-1 pr-1"
              >
                {opt.label}
                {!disabledValues?.includes(opt.value) && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => toggle(opt.value)}
                    aria-label={`Hapus ${opt.label}`}
                    className="rounded-full p-0.5 hover:bg-ink/10 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MultiSelectField({
  name,
  label,
  description,
  optional,
  disabled,
  className,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabledValues,
}: BaseFieldProps & {
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabledValues?: string[];
}) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <FormControl>
            <MultiSelect
              value={field.value ?? []}
              onChange={(v) => {
                field.onChange(v);
                field.onBlur();
              }}
              options={options}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyText={emptyText}
              disabled={disabled}
              disabledValues={disabledValues}
              invalid={!!fieldState.error}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/**
 * Tanggal/waktu memakai input bawaan browser (aksesibel, ada pemilih di HP).
 * Nilai disimpan apa adanya: `YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`, atau `HH:mm`.
 */
export function DateField({
  name,
  label,
  description,
  optional,
  disabled,
  className,
  type = 'datetime-local',
  min,
  max,
}: BaseFieldProps & {
  type?: 'date' | 'datetime-local' | 'time';
  min?: string;
  max?: string;
}) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              type={type}
              min={min}
              max={max}
              disabled={disabled}
              className="font-mono"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SwitchField({
  name,
  label,
  description,
  disabled,
  className,
}: Omit<BaseFieldProps, 'optional'>) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-row items-center justify-between gap-4 space-y-0 rounded-sm border border-line p-3',
            className,
          )}
        >
          <div className="flex flex-col gap-1">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={!!field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

/** Kontrol unggah gambar mandiri (pratinjau, ganti, hapus). */
export function ImageUpload({
  value,
  onChange,
  bucket,
  folder,
  prefix,
  valueAs = 'name',
  previewUrl,
  accept = 'image/*',
  deleteOnRemove = false,
  disabled,
  id,
  label = 'gambar',
  invalid,
  describedBy,
}: {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  bucket: StorageBucket;
  folder?: string;
  prefix?: string;
  /** Simpan nama file (default) atau URL publik lengkap. */
  valueAs?: 'name' | 'url';
  /** Ubah nilai tersimpan menjadi URL pratinjau. */
  previewUrl?: (value: string) => string;
  accept?: string;
  /** Hapus file dari storage saat tombol hapus ditekan. */
  deleteOnRemove?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading } = useStorageUpload({
    bucket,
    folder,
    prefix,
  });
  const src = value
    ? (previewUrl?.(value) ??
      (valueAs === 'url' || /^https?:/.test(value)
        ? value
        : storagePublicUrl(bucket, folder ? `${folder}/${value}` : value)))
    : null;
  const currentName =
    value && valueAs === 'name' ? value : value?.split('/').pop();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex size-24 items-center justify-center overflow-hidden rounded-sm border border-line bg-paper">
        {src ? (
          <img
            src={src}
            alt={`Pratinjau ${label}`}
            className="size-full object-cover"
          />
        ) : (
          <ImageUp
            className="size-6 text-ink-subtle"
            aria-hidden
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          disabled={disabled || isUploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            try {
              const res = await upload(file, {
                replace: valueAs === 'name' ? value : currentName,
              });
              onChange(valueAs === 'url' ? res.url : res.name);
            } catch {
              // toast sudah ditampilkan oleh useStorageUpload
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={isUploading}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {!isUploading && <ImageUp />}
          {value ? `Ganti ${label}` : `Unggah ${label}`}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || isUploading}
            onClick={async () => {
              if (deleteOnRemove && currentName) {
                try {
                  await remove([currentName]);
                } catch {
                  return;
                }
              }
              onChange(null);
            }}
          >
            <Trash2 />
            Hapus
          </Button>
        )}
      </div>
    </div>
  );
}

export function UploadField({
  name,
  label,
  description,
  optional,
  disabled,
  className,
  ...upload
}: BaseFieldProps &
  Omit<
    React.ComponentProps<typeof ImageUpload>,
    'value' | 'onChange' | 'disabled' | 'label' | 'id' | 'invalid'
  >) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <FormControl>
            <ImageUpload
              {...upload}
              value={field.value}
              onChange={(v) => {
                field.onChange(v);
                field.onBlur();
              }}
              label={label.toLowerCase()}
              disabled={disabled}
              invalid={!!fieldState.error}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** BlockNote (dengan LaTeX) dimuat hanya di client saat dibutuhkan. */
export const RichTextEditor = dynamic(
  () => import('@/components/ui/blocknote-editor'),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-24 items-center gap-2 rounded-sm border border-line bg-surface px-3 text-sm text-ink-subtle">
        <LoaderCircle
          className="size-4 animate-spin"
          aria-hidden
        />
        Memuat editor…
      </div>
    ),
  },
);

export function RichTextField({
  name,
  label,
  description,
  optional,
  className,
}: BaseFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FieldLabel
            label={label}
            optional={optional}
          />
          <div className="rounded-sm border border-line-strong bg-surface px-2 py-2">
            <RichTextEditor
              value={field.value ?? ''}
              onValueChange={(v: string) => field.onChange(v)}
            />
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
