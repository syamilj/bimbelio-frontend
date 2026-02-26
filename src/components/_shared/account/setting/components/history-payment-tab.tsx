import { Badge } from '@/components/ui/badge';
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
  return (
    <div className="p-5 space-y-3 pb-20">
      {data?.length > 0 ? (
        <div className="space-y-2">
          {data.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-3xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${mainColor}12` }}
                    >
                      <CreditCard
                        className="w-4 h-4"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {item.item_details?.[0]?.name || 'Transaksi'}
                    </p>
                  </div>
                  <Badge
                    className="text-[10px] font-bold rounded-3xl shrink-0 border-0"
                    style={{
                      backgroundColor:
                        item.transaction_status === 'SETTLEMENT'
                          ? '#dcfce7'
                          : item.transaction_status === 'PENDING'
                            ? '#fef3c7'
                            : item.transaction_status === 'EXPIRE'
                              ? '#fee2e2'
                              : '#f1f5f9',
                      color:
                        item.transaction_status === 'SETTLEMENT'
                          ? '#16a34a'
                          : item.transaction_status === 'PENDING'
                            ? '#d97706'
                            : item.transaction_status === 'EXPIRE'
                              ? '#dc2626'
                              : '#64748b',
                    }}
                  >
                    {item.transaction_status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span>
                      {getDateString(item.transaction_time)}{' '}
                      {getHours(item.transaction_time)}
                    </span>
                    <span>→</span>
                    <span className="text-red-400">
                      {getDateString(item.expired_time)}
                    </span>
                  </div>
                  <p
                    className="font-black text-sm"
                    style={{ color: mainColor }}
                  >
                    {item.transaction_details?.gross_amount?.toLocaleString(
                      'id-ID',
                      { style: 'currency', currency: 'IDR' },
                    )}
                  </p>
                </div>

                {item.transaction_status === 'PENDING' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                    <CancelPayment
                      id={item.id}
                      refetch={refetch}
                    />
                    <button
                      onClick={() => {
                        window.location.href = item.token;
                      }}
                      className="flex-1 px-3 py-1.5 rounded-3xl font-bold text-[11px] text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      style={{ backgroundColor: mainColor }}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Bayar
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <div
            className="w-12 h-12 rounded-3xl mx-auto mb-3 flex items-center justify-center"
            style={{ backgroundColor: `${mainColor}12` }}
          >
            <History
              className="w-6 h-6"
              style={{ color: mainColor }}
            />
          </div>
          <p className="text-sm font-bold text-slate-500">Belum ada riwayat</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Transaksi akan ditampilkan di sini
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
      onClick={() => cancelPayment({ payload: { id } })}
      disabled={cancelPaymentIsLoading}
      className="px-3 py-1.5 rounded-3xl font-bold text-[11px] text-slate-500 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
    >
      {cancelPaymentIsLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <>
          <X className="w-3.5 h-3.5" />
          Batal
        </>
      )}
    </button>
  );
};
