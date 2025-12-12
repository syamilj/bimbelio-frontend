'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import type { Category } from '@/types/database';
import { useEffect, useState } from 'react';
import SearchDeskstop from '../../_components/search-dekstop';
import Free from './free';
import Riwayat from './riwayat';
import Terbaru from './terbaru';
import Trending from './trending';

export default function ExploreClient() {
  const { data: session } = useSession();
  const [_category, setCategory] = useState<
    Omit<Category, 'to' | 'website_sub_category_id'>[]
  >([]);

  const fetchCategory = async () => {
    await getGeneral('/category/getAllCategories', {
      setData: setCategory,
    });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    const fullName = session?.user?.name || '';
    const [firstName, ...restNameParts] = fullName.split(' ').filter(Boolean);
    const lastName = restNameParts.length ? restNameParts.join(' ') : undefined;

    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Explore Document',
        content_type: 'page',
        page_path: `/user/explore`,
        content_id: 'explore_document_page',
      },
      user: session?.user
        ? {
            userId: session.user.id?.toString?.() || undefined,
            email: session.user.email || undefined,
            phone: session.user.phone || undefined,
            firstName: firstName || undefined,
            lastName,
          }
        : undefined,
    });
  }, [session]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Search Section */}
        <div className="hidden w-full justify-center md:flex">
          <div className="w-full max-w-2xl">
            <SearchDeskstop />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-12">
          {/* Free Section */}
          <section>
            <Free />
          </section>

          {/* Latest Section */}
          <section>
            <Terbaru />
          </section>

          {/* Trending Section */}
          <section>
            <Trending />
          </section>

          {/* History Section */}
          <section>
            <Riwayat />
          </section>
        </div>
      </div>
    </div>
  );
}
