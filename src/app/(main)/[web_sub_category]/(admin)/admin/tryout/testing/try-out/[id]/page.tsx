'use client';

import TryoutPage, {
  TryoutPageProps,
} from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/try-out/[id]/page';
import Provider from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/try-out/provider';

export default function TestingTryoutPage({ params }: TryoutPageProps) {
  // const { setHideLayout } = useAppContext();

  // useEffect(() => {
  //   setHideLayout(true);
  // }, []);

  return (
    <Provider>
      <TryoutPage params={params} />
    </Provider>
  );
}
