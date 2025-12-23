'use client';

import { notFound } from 'next/navigation';

export default function LandingPageWebsiteCategory() {
  //   const params = useParams();
  //   const web_sub_category = (params?.web_sub_category as string) || '';
  //   const url = window.location.origin;

  //   if (web_sub_category === 'snbt') {
  //     return <SNBT />;
  //   }
  //   if (web_sub_category === 'stan') {
  //     return <STAN />;
  //   }
  //   if (web_sub_category === 'simak-ui') {
  //     return <SIMAK_UI />;
  //   }
  //   if (web_sub_category === 'um-ugm') {
  //     return <UM_UGM />;
  //   }
  //   if (web_sub_category === 'tka') {
  //     return <TKA />;
  //   }

  return notFound();
}
