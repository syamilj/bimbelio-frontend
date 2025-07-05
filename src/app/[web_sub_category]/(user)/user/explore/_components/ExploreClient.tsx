'use client';

import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import type { Category } from '@/types/database';
import { useEffect, useState } from 'react';
import SearchDeskstop from '../../_components/search-dekstop';
import Free from './free';
import Riwayat from './riwayat';
import Terbaru from './terbaru';
import Trending from './trending';

export default function ExploreClient() {
  const [category, setCategory] = useState<
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Search Section */}
        <div className="hidden w-full justify-center md:flex">
          <div className="w-full max-w-2xl">
            <SearchDeskstop />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-16">
          {/* Free Section */}
          <section className="space-y-6">
            <Free />
          </section>

          {/* Latest Section */}
          <section className="space-y-6">
            <Terbaru />
          </section>

          {/* Trending Section */}
          <section className="space-y-6">
            <Trending />
          </section>

          {/* History Section */}
          <section className="space-y-6">
            <Riwayat />
          </section>
        </div>
      </div>
    </div>
  );
}
