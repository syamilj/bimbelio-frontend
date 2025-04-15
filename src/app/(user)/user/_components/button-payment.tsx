import { useAppContext } from '@/components/provider/provider-app';
import { cn } from '@/lib/utils';
import { IconCrown } from '@/styles/icon';

export default function ButtonPayment({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  const { setTransactionPopUp } = useAppContext();

  // return null;
  return (
    <button
      className={cn(
        'flex h-fit w-fit items-center gap-[.5rem] rounded-[.8rem] bg-greenUpgrade px-[1rem] py-[.7rem] text-[.9rem] text-white duration-300 active:bg-greenUpgradeHover md:hover:bg-greenUpgradeHover md:active:bg-greenUpgrade',
        className,
      )}
      onClick={() => setTransactionPopUp(true)}
    >
      <IconCrown w={15} />
      <p className="font-regular">{text ? text : 'Upgrade'}</p>
    </button>
  );
}
