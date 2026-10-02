'use client';

import { ContactDialog } from '@/components/layout/site/contact';
import { Slot } from 'radix-ui';
import { useState, type ReactNode } from 'react';

/** Membungkus tombol apa pun agar membuka dialog kontak saat diklik. */
export const SupportDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Slot.Root onClick={() => setOpen(true)}>{children}</Slot.Root>
      <ContactDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
};
