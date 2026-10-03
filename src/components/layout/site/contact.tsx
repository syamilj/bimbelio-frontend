'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CONTACT_CONFIG, whatsappUrl } from '@/config/contact';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import { MessageCircle, Phone, PhoneCall, Users } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const track = (input: Parameters<typeof trackUnifiedEvent>[0]) => {
  try {
    trackUnifiedEvent(input);
  } catch {
    // Pelacakan tidak boleh mengganggu interaksi.
  }
};

type ContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  /** Tampilkan ajakan bergabung ke grup belajar (default: ya). */
  showCommunity?: boolean;
};

const optionClassName =
  'group flex items-center gap-3 rounded-md border border-line p-3 text-left transition-colors hover:border-brand hover:bg-brand-soft focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none';

export function ContactDialog({
  open,
  onOpenChange,
  title = 'Tanya tim Bimbelio',
  description = `Konsultasi gratis soal program dan persiapan ujianmu. Senin–Jumat ${CONTACT_CONFIG.operationalHours.weekdays}, Sabtu–Minggu ${CONTACT_CONFIG.operationalHours.weekend}.`,
  showCommunity = true,
}: ContactDialogProps) {
  const close = () => onOpenChange(false);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={optionClassName}
            onClick={() => {
              track({
                eventName: 'Contact',
                customData: {
                  content_type: 'contact',
                  content_name: 'WhatsApp',
                  content_id: 'contact_whatsapp',
                  value: 1,
                },
              });
              close();
            }}
          >
            <OptionIcon icon={MessageCircle} />
            <OptionText
              title="Chat di WhatsApp"
              detail={CONTACT_CONFIG.whatsapp.display}
            />
          </a>
          <a
            href={`tel:${CONTACT_CONFIG.phone.number}`}
            className={optionClassName}
            onClick={() => {
              track({
                eventName: 'Contact',
                customData: {
                  content_type: 'contact',
                  content_name: 'Phone',
                  content_id: 'contact_phone',
                  value: 1,
                },
              });
              close();
            }}
          >
            <OptionIcon icon={Phone} />
            <OptionText
              title="Telepon"
              detail={CONTACT_CONFIG.phone.display}
            />
          </a>
          {showCommunity && (
            <a
              href={CONTACT_CONFIG.communityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={optionClassName}
              onClick={() => {
                track({
                  eventName: 'Lead',
                  customData: {
                    content_type: 'community',
                    content_name: 'discord_group',
                    content_id: 'discord_group_join',
                    value: 0,
                  },
                });
                close();
              }}
            >
              <OptionIcon icon={Users} />
              <OptionText
                title="Gabung grup belajar"
                detail="Gratis, belajar bareng siswa lain"
              />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OptionIcon({ icon: Icon }: { icon: typeof Phone }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-line-strong text-brand-strong transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-ink">
      <Icon
        className="size-5"
        aria-hidden
      />
    </span>
  );
}

function OptionText({ title, detail }: { title: string; detail: string }) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="text-sm font-semibold text-ink">{title}</span>
      <span className="truncate text-sm text-ink-muted">{detail}</span>
    </span>
  );
}

type ContactContextValue = { openContact: () => void };
const ContactContext = createContext<ContactContextValue | null>(null);

/** Satu dialog kontak untuk seluruh halaman; dibuka lewat `useContact()`. */
export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openContact = useCallback(() => {
    track({
      eventName: 'ViewContent',
      customData: {
        content_type: 'page',
        content_name: 'Contact Modal',
        content_id: 'floating_contact_modal',
        page_path: '/contact-modal',
      },
    });
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openContact }), [openContact]);

  return (
    <ContactContext.Provider value={value}>
      {children}
      <ContactDialog
        open={open}
        onOpenChange={setOpen}
      />
    </ContactContext.Provider>
  );
}

export const useContact = () => {
  const ctx = useContext(ContactContext);
  if (!ctx)
    throw new Error('useContact harus berada di dalam <ContactProvider>');
  return ctx;
};

export function FloatingContactButton({ className }: { className?: string }) {
  const { openContact } = useContact();
  return (
    <button
      type="button"
      onClick={openContact}
      aria-label="Buka menu konsultasi"
      className={cn(
        'fixed right-4 bottom-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-ink pr-5 pl-4 text-sm font-semibold text-white shadow-float ring-1 ring-white/25 transition-colors hover:bg-brand-deep focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none sm:right-6 sm:bottom-6',
        className,
      )}
    >
      <PhoneCall
        className="size-5"
        aria-hidden
      />
      Konsultasi
    </button>
  );
}

/** Tombol pembuka dialog kontak untuk dipakai di dalam halaman (server component aman). */
export function ContactButton({
  children = 'Konsultasi gratis',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'onClick'>) {
  const { openContact } = useContact();
  return (
    <Button
      {...props}
      onClick={openContact}
    >
      {children}
    </Button>
  );
}
