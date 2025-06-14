import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { IconCrown, IconX } from '@/styles/icon';
import { Pricing } from '@/types/database';
import { Loader2, Loader2Icon } from 'lucide-react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { useProvider } from '../../_provider/provider';

export default function PaymentPrediction({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState<number>(1);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px] w-[95vw] p-0 rounded-[1.5rem]"
          hideClose
        >
          <div className="overflow-hidden rounded-[1.5rem] bg-white">
            <div className="flex items-center justify-between bg-main p-[1.5rem]">
              <div className="flex items-center gap-[.5rem] text-white">
                <p>Prediction</p>
                <IconCrown className="text-main-yellow" />
              </div>
              <div
                className="absolute right-4"
                onClick={() => {
                  setOpen(false);
                  setStep(1);
                }}
              >
                <IconX className="cursor-pointer text-white duration-300 hover:text-main-gray-input" />
              </div>
            </div>

            {step === 1 && <Step1 setStep={setStep} />}
            {step === 2 && (
              <Step2
                setStep={setStep}
                setOpen={setOpen}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* <ConfirmPhoneDialog onSubmit={addPayment} /> */}
    </>
  );
}
const Step1 = ({ setStep }: { setStep: Dispatch<SetStateAction<number>> }) => {
  const { selectedPrograms } = useProvider();
  const { data: pricing, isLoading: pricingIsLoading } = useGet<Pricing>(
    '/pricing/getPricingBySlug?slug=prediction_unlock',
  );

  console.log({ pricing });

  return (
    <div className="flex flex-col gap-[2rem] p-[1.5rem]">
      <p className="">Akses lengkap seluruh detail prediksi kelulusan Anda:</p>
      <div className="mt-[-1rem] grid grid-cols-5 gap-y-2 text-[.9rem]">
        <p className="col-span-2 text-main-gray-text">Jenis Prediksi</p>
        <p className="col-span-3">: UTBK + SIMAK UI</p>
        <p className="col-span-2 text-main-gray-text">Universitas</p>
        <p className="col-span-3">: Universitas Indonesia</p>
        <p className="col-span-2 text-main-gray-text">Program Studi</p>
        <p className="col-span-3">: {selectedPrograms?.study}</p>
        {/* <p className="col-span-2 text-main-gray-text">Tanggal Prediksi</p>
        <p className="col-span-3">: {predictionDate}</p> */}
      </div>

      <button
        className={cn(
          'flex items-center justify-center rounded-[1rem] bg-main py-[1rem] text-white duration-300 hover:bg-main/85 active:bg-main',
          // loading && 'cursor-pointer hover:bg-main/85 active:bg-main',
        )}
        onClick={() => {
          if (pricingIsLoading) return;
          setStep(2);
        }}
      >
        {pricingIsLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          `Beli Rp. ${pricing?.price.toLocaleString('id-ID', {
            style: 'decimal',
          })}`
        )}
      </button>
    </div>
  );
};

const Step2 = ({
  setStep,
  setOpen,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    useParams: { predictionId },
  } = useProvider();
  const { setPagesSetting, setTransactionHistory } = useAppContext();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [telp, setTelp] = useState('');

  const { mutate: addPayment } = useMutation<{ token: string }>(
    '/payment/addPaymentPrediction',
    'post',
    {
      payload: { type: 'limit', userId: session?.user.id, predictionId },
      onSuccess({ data }) {
        window.snap.pay(`${data?.token}`, {
          onClose: () => {
            setPagesSetting('rt');
            setTransactionHistory(true);
          },
        });
      },
    },
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await addPayment({ payload: { telp } });
    setLoading(false);
    setOpen(false);
    setStep(1);
  };

  return (
    <div className="flex flex-col gap-[2rem] p-[1.5rem]">
      <p className="text-sm text-muted-foreground text-center">
        Harap isi nomor teleponmu untuk melanjutkan ke laman pembayaran.
      </p>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Input
            type="tel"
            placeholder="Nomor Telepon"
            onChange={(e) => setTelp(e.target.value)}
            className="w-full"
            required
          />
          <p className="text-sm text-muted-foreground">
            *Nomor teleponmu dibutuhkan untuk menghubungi kamu jika terdapat
            kendala.
          </p>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || telp.length === 0}
        >
          {loading ? (
            <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {loading ? 'Memproses...' : 'Bayar'}
        </Button>
      </form>
    </div>
  );
};
