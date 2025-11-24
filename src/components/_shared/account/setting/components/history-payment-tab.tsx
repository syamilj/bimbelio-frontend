import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { getDateString, getHours } from '@/lib/utils';
import { MidtransTransaction } from '@/types/midtrans-type';
import { ArrowRight, CreditCard, History, Loader2, X } from 'lucide-react';

export const HistoryPaymentTab = ({
  data,
  mainColor,
  secondaryColor,
  refetch,
}: {
  data: MidtransTransaction[];
  mainColor: string;
  secondaryColor: string;
  refetch: () => any;
}) => {
  console.log({ data });

  return (
    <div className="p-8 space-y-6 mb-30">
      <div className="text-center mb-8 sticky top-0 bg-white pt-2 z-10">
        <h2
          className="text-2xl font-black mb-2"
          style={{ color: mainColor }}
        >
          Riwayat Transaksi
        </h2>
        <p className="text-gray-500 font-medium">Lihat semua transaksi Kamu</p>
      </div>

      {data?.length > 0 ? (
        <div className="space-y-4 pb-4">
          {data.map((item, i) => (
            <Card
              key={i}
              className="border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              style={{
                borderLeft: `4px solid ${mainColor}`,
              }}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className="p-3 rounded-2xl flex-shrink-0"
                      style={{
                        backgroundColor: `${mainColor}20`,
                      }}
                    >
                      <CreditCard
                        className="w-5 h-5 md:w-6 md:h-6"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 truncate">
                        {item.item_details?.[0]?.name || 'Transaksi'}
                      </p>
                      <div className="flex flex-col gap-2 mt-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-400 uppercase flex-shrink-0">
                            Dibuat
                          </span>
                          <div
                            className="px-2 py-1 rounded-lg"
                            style={{ backgroundColor: `${mainColor}15` }}
                          >
                            <p className="font-bold text-gray-700">
                              {getDateString(item.transaction_time)}
                            </p>
                            <p className="text-gray-600">
                              {getHours(item.transaction_time)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-400 uppercase flex-shrink-0">
                            Expire
                          </span>
                          <div
                            className="px-2 py-1 rounded-lg"
                            style={{ backgroundColor: '#fee2e215' }}
                          >
                            <p className="font-bold text-gray-700">
                              {getDateString(item.expired_time)}
                            </p>
                            <p className="text-red-600 font-semibold">
                              {getHours(item.expired_time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-row md:flex-col items-end gap-2 w-full justify-between md:justify-start md:w-[unset] flex-wrap">
                    <p
                      className="font-black text-base md:text-lg"
                      style={{ color: mainColor }}
                    >
                      {item.transaction_details?.gross_amount?.toLocaleString(
                        'id-ID',
                        {
                          style: 'currency',
                          currency: 'IDR',
                        },
                      )}
                    </p>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className="font-bold text-xs rounded-xl"
                        style={{
                          backgroundColor:
                            item.transaction_status === 'SETTLEMENT'
                              ? '#10b981'
                              : item.transaction_status === 'PENDING'
                                ? '#f59e0b'
                                : item.transaction_status === 'EXPIRE'
                                  ? '#f5260b'
                                  : '#5e5e5e',
                          color: 'white',
                        }}
                      >
                        {item.transaction_status}
                      </Badge>
                      {item.transaction_status === 'PENDING' && (
                        <div className="flex flex-col sm:flex-row items-end gap-2 w-full md:w-auto">
                          <CancelPayment
                            id={item.id}
                            refetch={refetch}
                          />
                          <button
                            onClick={() => {
                              window.location.href = item.token;
                            }}
                            className="flex-1 sm:flex-none px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-lg hover:shadow-xl cursor-pointer bg-main-default whitespace-nowrap"
                          >
                            <CreditCard className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">
                              Bayar Sekarang
                            </span>
                            <span className="sm:hidden">Bayar</span>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className="rounded-3xl p-12 text-center border-2 border-gray-100"
          style={{
            background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}10)`,
          }}
        >
          <History
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: mainColor }}
          />
          <h3 className="text-lg font-black text-gray-900 mb-2">
            Belum ada riwayat transaksi
          </h3>
          <p className="text-gray-500 font-medium">
            Semua transaksi Kamu akan ditampilkan di sini
          </p>
        </div>
      )}
    </div>
  );
};

const CancelPayment = ({ refetch, id }: { refetch: () => any; id: string }) => {
  const { mutate: cancelPayment, isLoading: cancelPaymentIsLoading } =
    useMutation('/payment/cancelPayment', 'put', {
      onSuccess() {
        refetch();
      },
    });
  return (
    <button
      onClick={() => {
        cancelPayment({
          payload: {
            id,
          },
        });
      }}
      disabled={cancelPaymentIsLoading}
      className="flex-1 sm:flex-none px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold text-xs text-gray-600 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform shadow-lg hover:shadow-xl cursor-pointer bg-gray-200 hover:bg-gray-300 whitespace-nowrap"
    >
      {cancelPaymentIsLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <X className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Batal</span>
          <span className="sm:hidden">Batal</span>
        </>
      )}
    </button>
  );
};
