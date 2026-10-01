import LayoutGuest from '@/components/layout/layoutGuest';
import ProviderApp from '@/components/provider/provider-app';
import ProviderLimitation from '@/components/provider/provider-limitation';
import ProviderPixel from '@/components/provider/provider-pixel';
import ProviderSessionAuth from '@/components/provider/provider-session-auth';
import ProviderWebsiteCategory from '@/components/provider/provider-website-category';
import { Suspense } from 'react';

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <ProviderSessionAuth>
        <ProviderLimitation>
          <ProviderPixel>
            <ProviderWebsiteCategory>
              <ProviderApp>
                <LayoutGuest>{children}</LayoutGuest>
              </ProviderApp>
            </ProviderWebsiteCategory>
          </ProviderPixel>
        </ProviderLimitation>
      </ProviderSessionAuth>
    </Suspense>
  );
}
