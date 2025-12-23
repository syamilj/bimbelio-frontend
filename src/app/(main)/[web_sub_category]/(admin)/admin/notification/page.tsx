'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingPageWithText from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { socketApi } from '@/lib/socket/api/_core';
import {
  NotificationCategoryEnum,
  NotificationPriorityEnum,
  NotificationRelatedTypeEnum,
  NotificationTypeEnum,
} from '@/types/database';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface NotificationFormData {
  userId?: string;
  isBroadcast: boolean;
  title: string;
  content: string;
  description?: string;
  runAt?: string;
  type: string;
  category: string;
  relatedResourceId?: string;
  relatedResourceType?: string;
  actionUrl?: string;
  metadata?: string;
  isSendingWhatsApp?: boolean;
  isSendingEmail?: boolean;
  maxRetries: string;
}

export default function CreateNotification() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, watch, setValue } =
    useForm<NotificationFormData>({
      defaultValues: {
        isBroadcast: true,
        isSendingWhatsApp: false,
        isSendingEmail: false,
      },
    });

  const broadcastValue = watch('isBroadcast');
  const metadataValue = watch('metadata');

  const onSubmit = async (data: NotificationFormData) => {
    try {
      setIsLoading(true);

      const payload = {
        userId: data.userId,
        isBroadcast: data.isBroadcast,
        title: data.title,
        content: data.content,
        description: data.description,
        type: data.type as NotificationTypeEnum,
        category: data.category as NotificationCategoryEnum,
        priority: 'NORMAL' as NotificationPriorityEnum,
        relatedResourceId: data.relatedResourceId || undefined,
        relatedResourceType:
          data.relatedResourceType as NotificationRelatedTypeEnum,
        actionUrl: data.actionUrl || undefined,
        metadata: data.metadata ? JSON.parse(data.metadata) : undefined,
        runAt: data.runAt ? new Date(data.runAt) : undefined,
        // whatsApp: data.whatsApp,
        // email: data.email,
        retryCount: 0,
        maxRetries: parseInt(data.maxRetries),
      };

      console.log({ payload });

      const isSuccess = await socketApi.addNotification(payload);

      if (isSuccess) {
        toaster({
          title: 'Notifikasi berhasil dibuat',
          description: 'Notifikasi telah ditambahkan ke antrean pengiriman.',
          condition: 'success',
        });
      } else {
        toaster({
          title: 'Gagal membuat notifikasi',
          description: 'Terjadi kesalahan saat menambahkan notifikasi.',
          condition: 'warning',
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Gagal membuat notifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LoadingPageWithText
        loading={isLoading}
        heading="Membuat notifikasi..."
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Buat Notifikasi Baru
          </h1>
          <p className="text-gray-600">
            Tambahkan notifikasi baru untuk pengguna
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Judul <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('title', { required: true })}
                placeholder="Contoh: Kursus Baru Tersedia"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Konten <span className="text-red-500">*</span>
              </Label>
              <Textarea
                {...register('content', { required: true })}
                placeholder="Konten notifikasi yang akan ditampilkan"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Deskripsi <span className="text-gray-500">(optional)</span>
              </Label>
              <Textarea
                {...register('description')}
                placeholder="Deskripsi tambahan (optional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxRetries">Maksimal Retry</Label>
              <Input
                {...register('maxRetries')}
                type="number"
                placeholder="Contoh: 3"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="runAt">
                Jadwal Pengiriman{' '}
                <span className="text-gray-500">(optional)</span>
              </Label>
              <Input
                {...register('runAt')}
                type="datetime-local"
                placeholder="Pilih tanggal dan waktu"
              />
              <p className="text-xs text-gray-500">
                Biarkan kosong untuk mengirim segera
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="isBroadcast"
                  checked={broadcastValue}
                  onCheckedChange={(checked) => {
                    setValue('isBroadcast', true);
                    if (checked) {
                      setValue('userId', '');
                    }
                  }}
                />
                <Label
                  htmlFor="isBroadcast"
                  className="font-medium cursor-pointer"
                >
                  Kirim ke semua pengguna (Broadcast)
                </Label>
              </div>

              {!broadcastValue && (
                <div className="space-y-2 mt-3">
                  <Label htmlFor="userId">
                    ID Pengguna <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('userId', {
                      required: !broadcastValue,
                    })}
                    placeholder="Masukkan user ID"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Communication Channels */}
        {broadcastValue === false && (
          <Card>
            <CardHeader>
              <CardTitle>Saluran Komunikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="isSendingEmail"
                  {...register('isSendingEmail')}
                />
                <Label
                  htmlFor="isSendingEmail"
                  className="font-medium cursor-pointer"
                >
                  Kirim via Email
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isSendingWhatsApp"
                  {...register('isSendingWhatsApp')}
                />
                <Label
                  htmlFor="isSendingWhatsApp"
                  className="font-medium cursor-pointer"
                >
                  Kirim via WhatsApp
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Type and Category */}
        <Card>
          <CardHeader>
            <CardTitle>Tipe & Kategori</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Tipe Notifikasi <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe notifikasi" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {NOTIFICATION_TYPES.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            {type.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTIFICATION_CATEGORIES.map((cat) => (
                          <SelectItem
                            key={cat}
                            value={cat}
                          >
                            {cat.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Resource */}
        <Card>
          <CardHeader>
            <CardTitle>Sumber Terkait (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="relatedResourceType">Tipe Sumber</Label>
                <Controller
                  name="relatedResourceType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe sumber" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATED_RESOURCE_TYPES.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            {type.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatedResourceId">ID Sumber</Label>
                <Input
                  {...register('relatedResourceId')}
                  placeholder="ID course / live class"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionUrl">URL Aksi (Optional)</Label>
              <Input
                {...register('actionUrl')}
                type="url"
                placeholder="https://example.com/action"
              />
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metadata">JSON Metadata</Label>
              <Textarea
                {...register('metadata')}
                placeholder='Contoh: {"key": "value"}'
                rows={4}
              />
              {metadataValue && (
                <p className="text-xs text-gray-500">
                  Format JSON akan divalidasi saat pengiriman
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Notifikasi
          </Button>
        </div>
      </form>
    </div>
  );
}

const NOTIFICATION_TYPES: NotificationTypeEnum[] = [
  'ORDER_CONFIRMATION',
  'ORDER_SHIPPED',
  'ORDER_DELIVERED',
  'PAYMENT_SUCCESSFUL',
  'PAYMENT_FAILED',
  'PAYMENT_REMINDER',
  'REFUND_PROCESSED',
  'SUBSCRIPTION_ACTIVATED',
  'SUBSCRIPTION_RENEWED',
  'SUBSCRIPTION_EXPIRING',
  'SUBSCRIPTION_EXPIRED',
  'SUBSCRIPTION_CANCELED',
  'INSTALLMENT_REMINDER',
  'INSTALLMENT_DUE',
  'INSTALLMENT_OVERDUE',
  'COURSE_ENROLLED',
  'COURSE_PROGRESS',
  'COURSE_COMPLETED',
  'NEW_COURSE_AVAILABLE',
  'COURSE_UPDATE',
  'LIVECLASS_SCHEDULED',
  'LIVECLASS_REMINDER',
  'LIVECLASS_STARTING',
  'LIVECLASS_ENDED',
  'LIVECLASS_REGISTRATION_CONFIRMED',
  'TRYOUT_STARTED',
  'TRYOUT_COMPLETED',
  'TRYOUT_RESULTS',
  'TRYOUT_AVAILABLE',
  'NEW_MESSAGE',
  'MESSAGE_REPLY',
  'SYSTEM_ALERT',
  'PROMOTION',
  'SPECIAL_OFFER',
  'ANNOUNCEMENT',
  'ACCOUNT_VERIFICATION',
  'PASSWORD_CHANGED',
  'LOGIN_ATTEMPT',
  'ACCOUNT_UPDATED',
  'GENERIC',
];

const NOTIFICATION_CATEGORIES: NotificationCategoryEnum[] = [
  'ORDER',
  'SUBSCRIPTION',
  'COURSE',
  'LIVE_CLASS',
  'TRYOUT',
  'MESSAGE',
  'PAYMENT',
  'SYSTEM',
  'PROMOTION',
  'ACCOUNT',
  'OTHER',
];

const RELATED_RESOURCE_TYPES: NotificationRelatedTypeEnum[] = [
  'COURSE',
  'LIVE_CLASS',
];
