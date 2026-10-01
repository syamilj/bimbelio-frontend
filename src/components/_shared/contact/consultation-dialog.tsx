'use client';

import { ContactDialog } from '@/components/layout/site/contact';

/** @deprecated Pakai `ContactDialog` / `useContact()` dari components/layout/site/contact. */
export default function ConsultationDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  showDiscordOption = true,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  showStats?: boolean;
  showDiscordOption?: boolean;
  onContactSelect?: (contactType: string) => void;
}) {
  return (
    <ContactDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      showCommunity={showDiscordOption}
    />
  );
}
