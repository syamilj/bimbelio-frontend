'use client';
import { Payment } from '@/app/[web_sub_category]/(user)/user/_components/payment';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { ClipboardCopy, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toaster } from '../ui/toaster';

export default function ProviderCheckPayment({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order_id = searchParams?.get('order_id');
  const transaction_status = searchParams?.get('transaction_status');

  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const checkPayment = async (order_id: string) => {
    const res = await mutateGeneral('/payment/checkPayment', {
      payload: { order_id },
      type: 'post',
      hideToast: true,
      onSuccess() {
        router.push(`${window.location.pathname}`);
      },
      onError() {
        router.push(`${window.location.pathname}`);
      },
    });
    return res;
  };

  const handleCheckPayment = useDebouncedCallback(
    async (order_id: string, transaction_status: string) => {
      const res = await checkPayment(order_id);
      console.log({ res });
      const inviteLink = res?.data?.inviteLink as string | undefined;
      if (
        res &&
        new Date(res?.data?.expired_time) > new Date() &&
        transaction_status === 'settlement'
      ) {
        toaster({
          title: 'Pembelian Berhasil',
          condition: 'success',
          description: 'Pembelian berhasil dilakukan',
        });

        if (inviteLink) {
          setInviteLink(inviteLink);
        }
      }
    },
    500,
  );
  useEffect(() => {
    if (order_id && transaction_status) {
      handleCheckPayment(`${order_id}`, `${transaction_status}`);
    }
  }, [order_id, transaction_status]);
  return (
    <>
      <Payment />
      {children}
      <Dialog
        open={!!inviteLink}
        onOpenChange={(open) => !open && setInviteLink(null)}
      >
        <DialogContent className="rounded-2xl shadow-2xl border border-main-default max-w-md">
          <DialogHeader>
            <DialogTitle className="text-main-default text-lg font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-main-default" />
              Gabung Grup Telegram
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 mb-4">
            Selamat! Pembelian kamu berhasil. Gabung grup Telegram sekarang
            untuk mendapatkan informasi terbaru.
          </p>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <a
              href={inviteLink ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button className="w-full bg-main-default hover:bg-main-default/90 text-white font-semibold rounded-md">
                <Send className="mr-2 h-4 w-4" />
                Gabung Sekarang
              </Button>
            </a>

            <Button
              variant="outline"
              className="w-full sm:w-auto border-main-default text-main-default hover:bg-main-default/10"
              onClick={() => {
                if (inviteLink) {
                  navigator.clipboard.writeText(inviteLink);
                  toaster({
                    title: 'Berhasil',
                    condition: 'success',
                    description: 'Link berhasil disalin!',
                  });
                }
              }}
            >
              <ClipboardCopy className="mr-2 h-4 w-4" />
              Salin Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
