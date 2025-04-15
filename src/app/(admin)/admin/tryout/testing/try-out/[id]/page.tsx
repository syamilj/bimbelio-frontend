'use client';

import TryoutPage, {
  TryoutPageProps,
} from '@/app/(user)/user/try-out/[id]/page';

export default function TestingTryoutPage({ params }: TryoutPageProps) {
  // const { setHideLayout } = useAppContext();

  // useEffect(() => {
  //   setHideLayout(true);
  // }, []);

  return <TryoutPage params={params} />;
}
