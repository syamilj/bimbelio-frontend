import ButtonPayment from '@/app/(main)/[web_sub_category]/(user)/user/_components/button-payment';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { Card, CardContent } from '@/components/ui/card';
import { IconCrown } from '@/styles/icon';

export const SubscriptionTab = ({ data, handlePay, mainColor }: any) => (
  <div className="p-8 space-y-6">
    <div className="text-center mb-8">
      <h2
        className="text-2xl font-black mb-2"
        style={{ color: mainColor }}
      >
        Subscription & Coin
      </h2>
      <p className="text-gray-500 font-medium">
        Kelola langganan dan tagihan Kamu
      </p>
    </div>

    <Card className="border-2 border-gray-100 rounded-3xl shadow-sm">
      <CardContent className="p-8">
        <Plans />
        <div className="mt-8 pt-8 border-t-2 border-gray-100">
          <ButtonPayment text="Upgrade Subscription" />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Plans Component
const Plans = () => {
  const { userLimitation } = useUserLimitation();
  const { data: session } = useSession();
  const features = session?.user.feature;
  const role = session?.user.role;
  const tier = session?.user.tier;
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-gray-50 p-6 border-2 border-gray-100">
      <div
        id="heading"
        className="flex flex-col"
      >
        <div className="flex items-center gap-[.5rem]">
          <p className="font-black text-gray-900">{tier ? tier : 'Gratis'}</p>
          {tier && <IconCrown className="text-main-yellow" />}
        </div>
      </div>
      <div
        id="info"
        className="grid grid-cols-2 gap-y-8"
      >
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">
            Akses bahan ajar
          </p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {!features?.course ? 'Terbatas' : 'Semua'}
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Akses Document</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {!features?.document ? 'Terbatas' : 'Semua'}
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Chat AI</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.chat}/
            {userLimitation?.chatLimit
              ? userLimitation?.chatLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Notes</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.notes}/
            {userLimitation?.notesLimit
              ? userLimitation?.notesLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Quiz</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.quiz}/
            {userLimitation?.quizLimit
              ? userLimitation?.quizLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Tryout</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.tryout}/
            {userLimitation?.tryoutLimit
              ? userLimitation?.tryoutLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-gray-500 font-bold">Vision</p>
          <h1 className="text-[1rem] font-black text-gray-900">
            {role === 'ADMIN' ? '-' : userLimitation?.vision}/
            {userLimitation?.visionLimit
              ? userLimitation?.visionLimit
              : 'Unlimited'}{' '}
            <span className="font-medium text-[.8rem] text-gray-400">coin</span>
          </h1>
        </div>
      </div>
    </div>
  );
};
