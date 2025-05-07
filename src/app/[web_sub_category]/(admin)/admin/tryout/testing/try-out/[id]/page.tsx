'use client';

import TryoutPage, {
  TryoutPageProps,
} from '@/app/[web_sub_category]/(user)/user/try-out/[id]/page';

export default function TestingTryoutPage({ params }: TryoutPageProps) {
  // const { setHideLayout } = useAppContext();

  // useEffect(() => {
  //   setHideLayout(true);
  // }, []);

  return <TryoutPage params={params} />;
}
