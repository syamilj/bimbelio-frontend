'use client';

import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  Bell,
  BellOff,
  ChevronLeft,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface NotificationPreference {
  id: string;
  userId: string;
  website_sub_category_id: string;
  mutedTypes: string[];
  disableWhatsApp: boolean;
  disableEmail: boolean;
  disablePopup: boolean;
  disableSound: boolean;
  muteUntil: string | null;
}

const MUTE_PRESETS = [
  { label: '1 Jam', hours: 1 },
  { label: '8 Jam', hours: 8 },
  { label: '24 Jam', hours: 24 },
];

export default function NotificationSettingsPage() {
  const params = useParams<{ web_sub_category: string }>();
  const webSubCategory = params?.web_sub_category || '';
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [localPref, setLocalPref] = useState<Partial<NotificationPreference>>({
    disablePopup: false,
    disableSound: false,
    disableEmail: false,
    disableWhatsApp: false,
    muteUntil: null,
  });

  const { data, isLoading } = useGet<NotificationPreference>(
    '/notification/preference',
    {
      params: { website_sub_category_id: webSubCategory },
      useEffectDependencies: [webSubCategory],
      onSuccess(res) {
        const pref = res?.data;
        if (pref) {
          setLocalPref({
            disablePopup: pref.disablePopup,
            disableSound: pref.disableSound,
            disableEmail: pref.disableEmail,
            disableWhatsApp: pref.disableWhatsApp,
            muteUntil: pref.muteUntil,
          });
        }
      },
    },
  );

  const isMuted =
    localPref.muteUntil && new Date(localPref.muteUntil) > new Date();

  const muteUntilLabel = isMuted
    ? (() => {
        const diff = new Date(localPref.muteUntil!).getTime() - Date.now();
        const h = Math.floor(diff / 3_600_000);
        const m = Math.floor((diff % 3_600_000) / 60_000);
        if (h > 0) return `${h}j ${m}m lagi`;
        return `${m}m lagi`;
      })()
    : null;

  const save = async (patch: Partial<NotificationPreference>) => {
    const next = { ...localPref, ...patch };
    setLocalPref(next);
    setIsSaving(true);
    try {
      await axiosInstanceWithToken.put('/notification/preference', {
        website_sub_category_id: webSubCategory,
        ...next,
      });
    } catch {
      toast.error('Gagal menyimpan pengaturan');
      setLocalPref(localPref); // rollback
    } finally {
      setIsSaving(false);
    }
  };

  const handleMute = async (hours: number) => {
    const until = new Date(Date.now() + hours * 3_600_000).toISOString();
    await save({ muteUntil: until });
    toast.success(`Notifikasi dimatikan selama ${hours} jam`);
  };

  const handleUnmute = async () => {
    await save({ muteUntil: null });
    toast.success('Notifikasi diaktifkan kembali');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full shrink-0"
              onClick={() => router.back()}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Pengaturan Notifikasi</h1>
              <p className="text-xs text-gray-500">Sesuaikan preferensi notifikasimu</p>
            </div>
            {isSaving && (
              <Loader2 className="ml-auto w-4 h-4 text-gray-400 animate-spin" />
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-8 h-8 text-gray-300" />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {/* Mute Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Mode Senyap</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Matikan semua notifikasi sementara
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4">
              {isMuted ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellOff className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-gray-700">
                      Senyap berakhir dalam{' '}
                      <span className="font-semibold text-amber-600">{muteUntilLabel}</span>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={handleUnmute}
                    disabled={isSaving}
                  >
                    Aktifkan lagi
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Pilih durasi untuk mematikan notifikasi:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {MUTE_PRESETS.map(({ label, hours }) => (
                      <Button
                        key={hours}
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs px-4 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700"
                        onClick={() => handleMute(hours)}
                        disabled={isSaving}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Cara Pengiriman</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pilih saluran notifikasi yang ingin diaktifkan
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              <ToggleRow
                icon={<Bell className="w-4 h-4 text-blue-500" />}
                label="Pop-up"
                description="Tampilkan notifikasi sebagai dialog pop-up di layar"
                checked={!localPref.disablePopup}
                onCheckedChange={(v) => save({ disablePopup: !v })}
                disabled={isSaving}
              />
              <ToggleRow
                icon={<Volume2 className="w-4 h-4 text-purple-500" />}
                label="Suara"
                description="Putar suara saat notifikasi baru tiba"
                checked={!localPref.disableSound}
                onCheckedChange={(v) => save({ disableSound: !v })}
                disabled={isSaving}
              />
              <ToggleRow
                icon={<Mail className="w-4 h-4 text-green-500" />}
                label="Email"
                description="Kirim notifikasi penting melalui email"
                checked={!localPref.disableEmail}
                onCheckedChange={(v) => save({ disableEmail: !v })}
                disabled={isSaving}
              />
              <ToggleRow
                icon={<MessageSquare className="w-4 h-4 text-emerald-500" />}
                label="WhatsApp"
                description="Kirim notifikasi melalui pesan WhatsApp"
                checked={!localPref.disableWhatsApp}
                onCheckedChange={(v) => save({ disableWhatsApp: !v })}
                disabled={isSaving}
              />
            </div>
          </div>

          <p className="text-xs text-center text-gray-400 pb-4">
            Perubahan disimpan otomatis
          </p>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="ml-4 flex-shrink-0"
      />
    </div>
  );
}
