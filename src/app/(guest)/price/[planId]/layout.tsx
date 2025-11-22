import { env } from '@/env.mjs';
import axios from 'axios';
import { Metadata, ResolvingMetadata } from 'next';
import { ReactNode } from 'react';
import { PlanDataType } from './components/_helper';

// Fetch plan data untuk dynamic metadata
async function getPlanData(slug: string): Promise<PlanDataType | null> {
  try {
    const response = await axios.get(
      `${env.NEXT_PUBLIC_API_URL}/plan/getSinglePlan?slug=${slug}`,
      //   {
      //     next: { revalidate: 3600 }, // Cache 1 jam
      //   },
    );

    console.log('OG : ', response.data);

    return response.data.data;
  } catch (error) {
    console.error('Error fetching plan:', error);
    return null;
  }
}
//
// Generate dynamic metadata
export async function generateMetadata(
  { params }: { params: Promise<{ planId: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const plan = await getPlanData((await params).planId);

  if (!plan) {
    return {
      title: 'Paket Tidak Ditemukan',
      description: 'Paket yang Anda cari tidak tersedia',
    };
  }

  return {
    title: `${plan.name} - Bimbelio`,
    description:
      plan.description ||
      `Paket ${plan.name} dari Bimbelio - Platform bimbingan belajar online terbaik`,

    // Open Graph
    openGraph: {
      title: `${plan.name} - Bimbelio`,
      description:
        plan.description ||
        `Paket ${plan.name} dari Bimbelio - Platform bimbingan belajar online terbaik`,
      images: [
        {
          url: plan.image || 'https://bimbelio.com/og.webp',
          width: 1200,
          height: 630,
          alt: plan.name,
        },
      ],
      type: 'website',
      url: `https://bimbelio.com/price/${plan.slug}`,
      siteName: 'Bimbelio',
    },
  };
}

export default function LayoutPriceDetail({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
