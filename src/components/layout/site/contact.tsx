'use client';

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
  'group border-line hover:border-brand hover:bg-brand-soft focus-visible:ring-brand flex items-center gap-3 rounded-md border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none';

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
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-brand-strong transition-colors group-hover:bg-surface">
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
        'fixed right-4 bottom-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-brand-strong pr-5 pl-4 text-sm font-semibold text-brand-ink shadow-overlay transition-colors hover:bg-brand-strong/90 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none sm:right-6 sm:bottom-6',
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
