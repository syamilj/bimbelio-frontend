import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toaster } from '@/components/ui/toaster';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { getDateString, getHours } from '@/lib/utils';
import { formatPhoneNumber } from '@/lib/utils/phone';
import {
  Subscription,
  SubscriptionInstallment,
  SubscriptionInstallmentLimitation,
} from '@/types/database';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Loader2,
  Phone,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

type InstallmentItemType = Subscription & {
  SubscriptionInstallment: (SubscriptionInstallment & {
    SubscriptionInstallmentLimitation?: SubscriptionInstallmentLimitation | null;
    paymentLink: string | null;
  })[];
};

export const TabInstallment = ({
  installment,
  mainColor,
  secondaryColor,
}: {
  installment: InstallmentItemType[];
  mainColor: string;
  secondaryColor: string;
}) => {
  const getStatusColor = (status: boolean, isPaid: boolean) => {
    if (isPaid) return { bg: '#10b98120', text: '#10b981', label: 'Lunas' };
    if (status)
      return { bg: '#f59e0b20', text: '#f59e0b', label: 'Jatuh Tempo' };
    return { bg: '#3b82f620', text: '#3b82f6', label: 'Pending' };
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<
    InstallmentItemType['SubscriptionInstallment'][0] | null
  >(null);

  const { mutate: createTransaction, isLoading } = useMutation<{
    invoiceUrl?: string;
  }>('/payment/createInstallmentTransaction', 'post', {
    payload: {
      subInstallmentId: selectedInstallment?.id,
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
    onSuccess({ data }) {
      if (data?.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        toaster({
          title: 'Gagal memproses pembayaran',
          condition: 'warning',
          description:
            'Gagal membuat link pembayaran. Silakan hubungi customer service.',
        });
      }
    },
  });

  const handleConfirmPayment = (phoneNumber: string) => {
    createTransaction({
      payload: {
        telp: phoneNumber,
      },
    });
  };

  return (
    <div className="p-8 space-y-6 mb-30">
      <DialogInstallmentPayment
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mainColor={mainColor}
        installment={selectedInstallment}
        isLoading={isLoading}
        onConfirm={handleConfirmPayment}
      />
      <div className="text-center mb-8 sticky top-0 bg-white pt-2 z-10">
        <h2
          className="text-2xl font-black mb-2"
          style={{ color: mainColor }}
        >
          Riwayat Cicilan
        </h2>
        <p className="text-gray-500 font-medium">
          Kelola semua cicilan pembayaran Kamu
        </p>
      </div>

      {installment && installment.length > 0 ? (
        <div className="space-y-6 pb-4">
          {installment.map((subscription, subIndex) => (
            <div
              key={subIndex}
              className="space-y-3 border-b pb-10"
            >
              {/* Header Subscription */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">
                    {subscription.planName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getDateString(subscription.createdAt)} •{' '}
                    {formatPrice(subscription.planPrice)}
                  </p>
                </div>
                <Badge
                  className="font-bold text-xs rounded-xl"
                  style={{
                    backgroundColor: `${mainColor}20`,
                    color: mainColor,
                  }}
                >
                  <Coins className="w-3 h-3 mr-1" />
                  {subscription.SubscriptionInstallment.length}x Cicilan
                </Badge>
              </div>

              {/* List Installment */}
              <div className="space-y-3">
                {subscription.SubscriptionInstallment.map(
                  (installmentItem, instIndex) => {
                    const statusColor = getStatusColor(
                      new Date(installmentItem.dueDate) < new Date(),
                      installmentItem.isPaid,
                    );

                    const hasLateFee =
                      installmentItem.lateFee > 0 &&
                      new Date(installmentItem.dueDate) < new Date() &&
                      !installmentItem.isPaid;

                    return (
                      <Card
                        key={instIndex}
                        className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        style={{
                          borderLeft: `4px solid ${mainColor}`,
                        }}
                      >
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col items-start gap-4">
                            {/* Top Section */}
                            <div className="flex items-start gap-3 md:gap-4 w-full">
                              <div
                                className="p-3 rounded-3xl flex-shrink-0 mt-1"
                                style={{
                                  backgroundColor: `${mainColor}20`,
                                }}
                              >
                                {installmentItem.isPaid ? (
                                  <CheckCircle2
                                    className="w-5 h-5 md:w-6 md:h-6"
                                    style={{ color: '#10b981' }}
                                  />
                                ) : new Date(installmentItem.dueDate) <
                                  new Date() ? (
                                  <AlertTriangle
                                    className="w-5 h-5 md:w-6 md:h-6"
                                    style={{ color: '#f59e0b' }}
                                  />
                                ) : (
                                  <Clock
                                    className="w-5 h-5 md:w-6 md:h-6"
                                    style={{ color: mainColor }}
                                  />
                                )}
                              </div>

                              <div className="w-full">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-bold text-gray-900">
                                    Cicilan #{installmentItem.installmentNumber}
                                  </p>
                                  <Badge
                                    className="font-bold text-xs rounded-lg"
                                    style={{
                                      backgroundColor: statusColor.bg,
                                      color: statusColor.text,
                                      border: `1px solid ${statusColor.text}40`,
                                    }}
                                  >
                                    {statusColor.label}
                                  </Badge>
                                </div>

                                {/* Amount Info */}
                                <div className="flex flex-col gap-2 text-xs mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-400 uppercase flex-shrink-0">
                                      Nominal
                                    </span>
                                    <div
                                      className="px-2 py-1 rounded-lg flex-1"
                                      style={{
                                        backgroundColor: `${mainColor}15`,
                                      }}
                                    >
                                      <p className="font-bold text-gray-900">
                                        {formatPrice(installmentItem.amount)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-400 uppercase flex-shrink-0">
                                      Jatuh Tempo
                                    </span>
                                    <div
                                      className="px-2 py-1 rounded-lg flex-1"
                                      style={{
                                        backgroundColor: installmentItem.isPaid
                                          ? '#10b98115'
                                          : new Date(installmentItem.dueDate) <
                                              new Date()
                                            ? '#f59e0b15'
                                            : '#3b82f615',
                                      }}
                                    >
                                      <p className="font-bold text-gray-700">
                                        {getDateString(installmentItem.dueDate)}
                                      </p>
                                      <p
                                        className="text-xs"
                                        style={{
                                          color: installmentItem.isPaid
                                            ? '#10b981'
                                            : new Date(
                                                  installmentItem.dueDate,
                                                ) < new Date()
                                              ? '#f59e0b'
                                              : '#3b82f6',
                                        }}
                                      >
                                        {getHours(installmentItem.dueDate)}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Grace Period */}
                                  {installmentItem.gracePeriodEndDate && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-400 uppercase flex-shrink-0">
                                        Tenggang
                                      </span>
                                      <div className="px-2 py-1 rounded-lg flex-1 bg-green-50">
                                        <p className="font-bold text-green-700 text-xs">
                                          Hingga{' '}
                                          {getDateString(
                                            installmentItem.gracePeriodEndDate,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {/* Expired Access Date */}
                                  {installmentItem.expiredAccessDate && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-400 uppercase flex-shrink-0">
                                        {installmentItem.installmentNumber !==
                                        subscription.SubscriptionInstallment
                                          .length
                                          ? 'Akses Ditangguhkan'
                                          : 'Akses Berakhir'}
                                      </span>
                                      <div
                                        className="px-2 py-1 rounded-lg flex-1"
                                        style={{
                                          backgroundColor:
                                            new Date(
                                              installmentItem.expiredAccessDate,
                                            ) < new Date()
                                              ? '#fee2e2'
                                              : '#fef3c7',
                                        }}
                                      >
                                        <p
                                          className="font-bold text-xs"
                                          style={{
                                            color:
                                              new Date(
                                                installmentItem.expiredAccessDate,
                                              ) < new Date()
                                                ? '#991b1b'
                                                : '#92400e',
                                          }}
                                        >
                                          {getDateString(
                                            installmentItem.expiredAccessDate,
                                          )}
                                          {new Date(
                                            installmentItem.expiredAccessDate,
                                          ) < new Date() && (
                                            <span className="text-red-600 ml-1">
                                              (Sudah Berakhir)
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Late Fee Info */}
                                {hasLateFee && (
                                  <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg mb-3">
                                    <AlertTriangle
                                      size={14}
                                      className="text-orange-600 mt-0.5 flex-shrink-0"
                                    />
                                    <div className="text-xs">
                                      <p className="font-bold text-orange-900">
                                        Denda Keterlambatan
                                      </p>
                                      <p className="text-orange-700">
                                        {formatPrice(installmentItem.lateFee)}{' '}
                                        (Total dengan denda:{' '}
                                        {formatPrice(
                                          installmentItem.amountWithLateFee,
                                        )}
                                        )
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Limitation Info */}
                                {installmentItem.SubscriptionInstallmentLimitation && (
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(
                                      installmentItem.SubscriptionInstallmentLimitation,
                                    )
                                      .filter(([key]) =>
                                        [
                                          'chat',
                                          'notes',
                                          'vision',
                                          'quiz',
                                          'tryout',
                                        ].includes(key),
                                      )
                                      .map(([key, value]) => (
                                        <Badge
                                          key={key}
                                          variant="outline"
                                          className="text-xs rounded-lg"
                                          style={{
                                            borderColor: `${mainColor}40`,
                                            color: mainColor,
                                            backgroundColor: `${mainColor}08`,
                                          }}
                                        >
                                          <span className="capitalize">
                                            {key}: {value}
                                          </span>
                                        </Badge>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bottom Section - Action */}
                            <div className="flex justify-end gap-2 w-full">
                              {!installmentItem.isPaid && (
                                <button
                                  className="flex-1 md:flex-none px-4 py-2 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap"
                                  style={{
                                    backgroundColor: mainColor,
                                  }}
                                  onClick={() => {
                                    if (installmentItem.paymentLink) {
                                      window.location.href =
                                        installmentItem.paymentLink;
                                      return;
                                    }
                                    setSelectedInstallment(installmentItem);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <CreditCard className="w-4 h-4 flex-shrink-0" />
                                  Bayar Sekarang
                                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                                </button>
                              )}

                              {installmentItem.isPaid && (
                                <div
                                  className="px-4 py-2 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 text-center"
                                  style={{
                                    backgroundColor: '#10b981',
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                  Sudah Dibayar
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  },
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-3xl p-12 text-center border-2 border-gray-100"
          style={{
            background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}10)`,
          }}
        >
          <Coins
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: mainColor }}
          />
          <h3 className="text-lg font-black text-gray-900 mb-2">
            Belum ada riwayat cicilan
          </h3>
          <p className="text-gray-500 font-medium">
            Semua cicilan Kamu akan ditampilkan di sini
          </p>
        </div>
      )}
    </div>
  );
};

const DialogInstallmentPayment = ({
  open,
  onOpenChange,
  installment,
  mainColor,
  isLoading = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  installment:
    | (SubscriptionInstallment & {
        paymentLink: string | null;
      })
    | null;
  mainColor: string;
  isLoading: boolean;
  onConfirm: (phoneNumber: string) => void;
}) => {
  const { data: session } = useSession();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (!open) {
      setPhoneNumber(formatPhoneNumber(session?.user.phone) || '');
      setPhoneError('');
    }
  }, [open, session]);

  const validatePhoneNumber = (phone: string) => {
    const formatted = phone;
    if (formatted.length < 12 || formatted.length > 15) {
      setPhoneError('Nomor telepon tidak valid');
      return false;
    }
    if (!/^\+62\d{9,12}$/.test(formatted)) {
      setPhoneError('Format nomor telepon tidak sesuai');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatPhoneNumber(e.target.value) || '';
    setPhoneNumber(value);
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleConfirmPayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

    if (!installment) {
      setPhoneError('Data cicilan tidak valid');
      return;
    }

    onConfirm(phoneNumber);
  };

  if (!installment) return null;

  const currentDate = new Date();
  const isLate = currentDate > new Date(installment.gracePeriodEndDate);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="sm:max-w-md rounded-3xl"
        classOverlay="z-[1001]"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Verifikasi Nomor Telepon
          </DialogTitle>
        </DialogHeader>

        {installment && (
          <div className="space-y-4">
            {/* Installment Info */}
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: `${mainColor}10`,
                borderLeft: `4px solid ${mainColor}`,
              }}
            >
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Cicilan #{installment.installmentNumber}
              </p>
              <div className="flex items-baseline gap-2">
                <p
                  className="text-2xl font-black"
                  style={{ color: mainColor }}
                >
                  {formatPrice(
                    isLate ? installment.amountWithLateFee : installment.amount,
                  )}
                </p>
                {isLate && (
                  <p className="text-xs text-gray-500 line-through">
                    {formatPrice(installment.amount)}
                  </p>
                )}
              </div>
              {isLate && (
                <p className="text-xs text-orange-600 mt-1">
                  Termasuk denda: {formatPrice(installment.lateFee)}
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <Input
                  type="tel"
                  placeholder="+628xxxxxxxxxx"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  disabled={isLoading}
                  className={`pl-10 rounded-xl border-2 ${
                    phoneError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-400'
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {phoneError}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Masukkan nomor telepon aktif Anda untuk verifikasi pembayaran
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl font-semibold"
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={isLoading || !phoneNumber}
                className="flex-1 rounded-xl font-semibold text-white"
                style={{
                  backgroundColor:
                    isLoading || !phoneNumber ? '#ccc' : mainColor,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Lanjut Bayar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
