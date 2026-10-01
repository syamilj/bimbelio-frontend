import { NotificationPopUp } from '@/components/_shared/notification/notification-pop-up';
import ProviderNotification from '@/components/provider/privoder-notification';
import ProviderApp from '@/components/provider/provider-app';
import ProviderCheckPayment from '@/components/provider/provider-check-payment';
import ProviderLimitation from '@/components/provider/provider-limitation';
import ProviderPixel from '@/components/provider/provider-pixel';
import ProviderSessionAuth from '@/components/provider/provider-session-auth';
import ProviderWebsiteCategory from '@/components/provider/provider-website-category';
import { Suspense } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <ProviderSessionAuth>
        <ProviderPixel>
          <ProviderWebsiteCategory>
            <ProviderLimitation>
              <ProviderApp>
                <ProviderNotification>
                  <NotificationPopUp />
                  <Suspense fallback={null}>
                    <ProviderCheckPayment>{children}</ProviderCheckPayment>
                  </Suspense>
                </ProviderNotification>
              </ProviderApp>
            </ProviderLimitation>
          </ProviderWebsiteCategory>
        </ProviderPixel>
      </ProviderSessionAuth>
    </Suspense>
  );
}
