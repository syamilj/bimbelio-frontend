'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MockLiveClass } from '@/lib/mock-data/live-class';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';

interface RegisterLiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveClass: MockLiveClass;
  userEmail: string;
  onRegister: (email: string) => void;
}

export function RegisterLiveClassModal({
  isOpen,
  onClose,
  liveClass,
  userEmail,
  onRegister,
}: RegisterLiveClassModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    if (!userEmail.trim()) return;

    setIsRegistering(true);
    try {
      await onRegister(userEmail);
      onClose();
    } catch (error) {
      console.error('Error registering for class:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Daftar Kelas
          </DialogTitle>
          <DialogDescription>
            Anda akan mendaftar untuk kelas "{liveClass.title}". Setelah
            mendaftar, admin akan menambahkan email Anda ke daftar tamu Google
            Meet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Anda</Label>
            <div className="p-3 bg-gray-50 border rounded-md">
              <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              <p className="text-xs text-gray-500">
                Email ini akan digunakan untuk undangan Google Meet
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1 text-blue-900">
              {liveClass.title}
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>Tutor: {liveClass.tutorName}</p>
              <p>
                Tanggal:{' '}
                {new Date(liveClass.scheduleDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p>
                Waktu: {liveClass.startTime} - {liveClass.endTime}
              </p>
              <p>Durasi: {Math.floor(liveClass.duration / 60)} jam</p>
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Setelah mendaftar, admin akan mengundang email Anda ke Google
              Meet. Anda akan mendapat notifikasi ketika sudah bisa join.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRegistering}
          >
            Batal
          </Button>
          <Button
            onClick={handleRegister}
            disabled={!userEmail.trim() || isRegistering}
          >
            {isRegistering ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Mendaftar...
              </>
            ) : (
              'Konfirmasi Pendaftaran'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
