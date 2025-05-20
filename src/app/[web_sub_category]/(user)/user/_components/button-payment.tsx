import { useAppContext } from '@/components/provider/provider-app';
import { cn } from '@/lib/utils';
import { IconCrown } from '@/styles/icon';
import Link from 'next/link';

export default function ButtonPayment({
  text,
  className,
  type = 'page',
}: {
  text?: string;
  className?: string;
  type?: 'modal' | 'page';
}) {
  // const { websiteSubCategory } = useWebsiteSubCategory();
  const { setTransactionPopUp } = useAppContext();

  // return null;

  if (type === 'modal') {
    return (
      <div
        className={cn(
          'flex h-fit w-fit items-center gap-[.5rem] rounded-[.8rem] px-[1rem] py-[.7rem] text-[.9rem] text-white duration-300 md:hover:opacity-90 bg-gradient',
          className,
        )}
        onClick={() => setTransactionPopUp(true)}
      >
        <IconCrown w={15} />
        <p className="font-regular">{text ? text : 'Upgrade'}</p>
      </div>
    );
  }

  return (
    <Link
      href={'/price'}
      className={cn(
        'flex h-fit w-fit items-center gap-[.5rem] rounded-[.8rem] px-[1rem] py-[.7rem] text-[.9rem] text-white duration-300 md:hover:opacity-90 bg-gradient',
        className,
      )}
      // onClick={() => setTransactionPopUp(true)}
    >
      <IconCrown w={15} />
      <p className="font-regular">{text ? text : 'Upgrade'}</p>
    </Link>
  );
}
