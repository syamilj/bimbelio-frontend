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
import { Mail } from 'lucide-react';
import { useState } from 'react';

interface JoinLiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveClass: MockLiveClass;
  userEmail: string;
  onJoin: (email: string) => void;
}

export function JoinLiveClassModal({
  isOpen,
  onClose,
  liveClass,
  userEmail,
  onJoin,
}: JoinLiveClassModalProps) {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!userEmail.trim()) return;

    setIsJoining(true);
    try {
      await onJoin(userEmail);
      // Redirect to Google Meet after confirmation
      window.open(liveClass.meetLink, '_blank');
      onClose();
    } catch (error) {
      console.error('Error joining class:', error);
    } finally {
      setIsJoining(false);
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
            <Mail className="h-5 w-5" />
            Join Live Class
          </DialogTitle>
          <DialogDescription>
            Konfirmasi email Anda untuk bergabung dengan kelas "
            {liveClass.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Anda</Label>
            <div className="p-3 bg-gray-50 border rounded-md">
              <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              <p className="text-xs text-gray-500">
                Pastikan email ini sama dengan yang terdaftar di Google Meet
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
                Waktu: {liveClass.startTime} - {liveClass.endTime}
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠️ Setelah klik "Join Meeting", Anda akan diarahkan ke Google
              Meet. Pastikan email yang Anda masukkan sudah diundang oleh admin.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isJoining}
          >
            Batal
          </Button>
          <Button
            onClick={handleJoin}
            disabled={!userEmail.trim() || isJoining}
            className="bg-green-600 hover:bg-green-700"
          >
            {isJoining ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Joining...
              </>
            ) : (
              'Join Meeting'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
