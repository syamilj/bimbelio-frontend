'use client';

import { notFound, useParams } from 'next/navigation';
import SIMAK_UI from './components/simak-ui';
import SNBT from './components/snbt';
import STAN from './components/stan';
import UM_UGM from './components/um-ugm';

export default function LandingPageWebsiteCategory() {
  const params = useParams();
  const web_sub_category = (params?.web_sub_category as string) || '';

  const url = window.location.origin;

  // if (url.includes('bimbelio')) return notFound();

  if (web_sub_category === 'snbt') {
    return <SNBT />;
  }
  if (web_sub_category === 'stan') {
    return <STAN />;
  }
  if (web_sub_category === 'simak-ui') {
    return <SIMAK_UI />;
  }
  if (web_sub_category === 'um-ugm') {
    return <UM_UGM />;
  }
  return notFound();
}
