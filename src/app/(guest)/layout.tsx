import { SiteFooter } from '@/components/layout/site/site-footer';
import { SiteShell } from '@/components/layout/site/site-shell';
import ProviderApp from '@/components/provider/provider-app';
import ProviderLimitation from '@/components/provider/provider-limitation';
import ProviderPixel from '@/components/provider/provider-pixel';
import ProviderSessionAuth from '@/components/provider/provider-session-auth';
import ProviderWebsiteCategory from '@/components/provider/provider-website-category';

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderSessionAuth>
      <ProviderLimitation>
        <ProviderPixel>
          <ProviderWebsiteCategory>
            <ProviderApp>
              <SiteShell footer={<SiteFooter />}>{children}</SiteShell>
            </ProviderApp>
          </ProviderWebsiteCategory>
        </ProviderPixel>
      </ProviderLimitation>
    </ProviderSessionAuth>
  );
}
