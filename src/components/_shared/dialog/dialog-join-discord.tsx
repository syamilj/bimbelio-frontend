'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toaster } from '@/components/ui/toaster';
import { ClipboardCopy } from 'lucide-react';
import { ReactNode, useState } from 'react';

export const DialogJoinDiscord = ({
  inviteLink,
  children,
}: {
  inviteLink: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  //   const { data: userData } = useGet('/user/getUserById');

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl shadow-2xl border-0 mb:max-w-md overflow-hidden">
        {/* Discord-themed gradient header */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#5865F2] via-[#4752C4] to-[#3c45a5]" />

        <DialogHeader className="relative z-10 pt-4">
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#5865F2"
              >
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
            </div>
            <span>Gabung Komunitas WhatsApp</span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 pt-6 pb-2 space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">
                  Pembelian Berhasil!
                </h4>
                <p className="text-sm text-green-700">
                  Selamat! Transaksi kamu telah berhasil diproses.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Bergabunglah dengan komunitas WhatsApp kami untuk:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#5865F2] rounded-full"></div>
                Akses konten eksklusif premium
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#5865F2] rounded-full"></div>
                Diskusi dengan member lainnya
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#5865F2] rounded-full"></div>
                Update & pengumuman terbaru
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 relative z-10">
          <a
            href={inviteLink ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-xl h-11 shadow-lg shadow-[#5865F2]/25 transition-all hover:shadow-xl hover:shadow-[#5865F2]/30">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-2"
              >
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
              </svg>
              Gabung WhatsApp Sekarang
            </Button>
          </a>

          <Button
            variant="outline"
            className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl h-11 font-medium transition-all"
            onClick={() => {
              if (inviteLink) {
                navigator.clipboard.writeText(inviteLink);
                toaster({
                  title: 'Berhasil',
                  condition: 'success',
                  description: 'Link WhatsApp berhasil disalin!',
                });
              }
            }}
          >
            <ClipboardCopy className="mr-2 h-4 w-4" />
            Salin Link Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
