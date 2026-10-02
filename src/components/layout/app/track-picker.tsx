'use client';

import { AnswerBubble } from '@/components/patterns/answer-bubble';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { isSplitDomains, trackIdFromPath } from '@/lib/surface';
import { appPath, rememberTrack } from '@/lib/track';
import { cn } from '@/lib/utils';
import type { WebsiteCategory, WebsiteSubCategory } from '@/types/database';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export type TrackGroup = WebsiteCategory & {
  WebsiteSubCategory: WebsiteSubCategory[];
};

type TrackPickerDialogProps = {
  groups: TrackGroup[];
  value?: string | null;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect: (track: WebsiteSubCategory) => void;
  /** Wajib memilih (tidak bisa ditutup) — mis. saat track di URL tidak valid. */
  required?: boolean;
};

/** Pilih jalur ujian (track). Pilihan ditandai bubble terisi seperti LJK. */
export function TrackPickerDialog({
  groups,
  value,
  open,
  onOpenChange,
  onSelect,
  required,
}: TrackPickerDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={required ? undefined : onOpenChange}
    >
      <DialogContent
        hideClose={required}
        onEscapeKeyDown={required ? (e) => e.preventDefault() : undefined}
        onPointerDownOutside={required ? (e) => e.preventDefault() : undefined}
        className="sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>Pilih jalur ujian</DialogTitle>
          <DialogDescription>
            Materi, try out, dan langgananmu mengikuti jalur yang dipilih. Kamu
            bisa menggantinya kapan saja.
          </DialogDescription>
        </DialogHeader>

        {groups.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">
            Memuat daftar jalur…
          </p>
        ) : (
          <div className="-mx-1 flex max-h-[60dvh] flex-col gap-5 overflow-y-auto px-1">
            {groups.map((group) => (
              <section
                key={group.id}
                className="flex flex-col gap-2"
              >
                <h3 className="text-xs font-semibold text-ink-muted">
                  {group.name}
                </h3>
                <div
                  role="radiogroup"
                  aria-label={group.name}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {group.WebsiteSubCategory.map((track) => {
                    const selected = track.id === value;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onSelect(track)}
                        className={cn(
                          'flex items-center gap-3 rounded-md border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
                          selected
                            ? 'border-brand-strong bg-brand-soft'
                            : 'border-line hover:border-line-strong hover:bg-paper',
                        )}
                      >
                        <AnswerBubble
                          size="xs"
                          state={selected ? 'filled' : 'empty'}
                        />
                        <span className="text-sm font-semibold text-ink">
                          {track.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Ganti track: simpan pilihan, lalu buka halaman yang sama di track baru. */
export function switchTrack(trackId: string) {
  rememberTrack(trackId);
  const { pathname } = window.location;
  // Navigasi penuh: sebagian halaman lama masih membaca track saat modul dimuat.
  if (trackIdFromPath(pathname) === undefined) {
    window.location.assign(appPath(trackId, 'bimboard'));
    return;
  }
  const rest = pathname.split('/').filter(Boolean).slice(1).join('/');
  // Di subdomain `/<track>` saja sudah dashboard (proxy yang mengarahkan).
  window.location.assign(
    `/${trackId}/${rest || (isSplitDomains() ? '' : 'user/bimboard')}`,
  );
}

/** Tombol di sidebar yang menampilkan track aktif dan membuka pemilih. */
export function TrackSwitcher({ compact }: { compact?: boolean }) {
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();
  const [open, setOpen] = useState(false);
  const name = websiteSubCategory?.name ?? 'Pilih jalur';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Jalur ujian: ${name}. Ganti jalur`}
        title={compact ? name : undefined}
        className={cn(
          'flex w-full items-center gap-2 rounded-md border border-line text-left transition-colors hover:bg-paper focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
          compact ? 'size-10 justify-center p-0' : 'h-11 px-3',
        )}
      >
        <span
          className="size-2.5 shrink-0 rounded-full bg-brand"
          aria-hidden
        />
        {!compact && (
          <>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="text-xs text-ink-muted">Jalur ujian</span>
              <span className="truncate text-sm font-semibold text-ink">
                {name}
              </span>
            </span>
            <ChevronsUpDown
              className="size-4 shrink-0 text-ink-muted"
              aria-hidden
            />
          </>
        )}
      </button>
      <TrackPickerDialog
        groups={webCategoryData}
        value={websiteSubCategory?.id}
        open={open}
        onOpenChange={setOpen}
        onSelect={(track) => {
          setOpen(false);
          if (track.id !== websiteSubCategory?.id) switchTrack(track.id);
        }}
      />
    </>
  );
}
