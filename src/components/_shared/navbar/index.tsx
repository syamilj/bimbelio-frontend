'use client';

import { useEffect, useState } from 'react';
import { useMedia } from 'use-media';

import { useSession } from '@/components/provider/provider-session-auth';
import { useGet } from '@/lib/fetch-helper/useGet';
import { PlanDataType } from '../other/card-plan/_provider/types';

import { DesktopNav } from './NavbarDesktop';
import { MobileNav } from './NavbarMobile';
import { navItems } from './navbar-config';
import type { NavItem } from './navbar-types';

type PricingDataType = {
  plans: PlanDataType[];
  topping: PlanDataType[];
  productCompare?: {
    subscription: PlanDataType[];
    bundles: PlanDataType[];
    listCompare: string[];
  };
};

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useMedia({ maxWidth: '768px' });

  const [navData, setNavData] = useState<NavItem[]>(navItems);

  const { data: PricingData } = useGet<PricingDataType>(
    '/plan/getAllPlanByWebCategory',
  );

  const plans = PricingData?.plans || [];

  useEffect(() => {
    if (plans.length === 0) return;

    setNavData((prev) =>
      prev.map((navitem) => {
        if (navitem.label === 'Program') {
          const subMenuColumns = navitem.submenuColumns || [];

          return {
            ...navitem,
            submenuColumns: [
              {
                title: 'Program',
                items: plans
                  .filter(
                    (item) =>
                      item.PlanSubscription &&
                      item.PlanSubscription?.PlanFeature.length > 0,
                  )
                  .map((plan, index) => ({
                    href: `/price/${plan.slug}`,
                    label: `Program ${index + 1}`,
                    description: plan.name,
                    icon: 'UserPlus',
                    isLink: true,
                  })),
              },
              {
                title: 'Koin',
                items: plans
                  .filter(
                    (item) => !item.PlanSubscription && item.PlanLimitation,
                  )
                  .map((plan) => ({
                    href: `/price/${plan.slug}`,
                    label: plan.name,
                    description: Object.entries(plan.PlanLimitation)
                      .filter(([key, value]) => {
                        if (
                          key === 'id' ||
                          key === 'validFrom' ||
                          key === 'validUntil' ||
                          key === 'isTimebound' ||
                          key === 'planId' ||
                          key === 'expireDays'
                        ) {
                          return false;
                        }
                        if (value === 0) {
                          return false;
                        }
                        return true;
                      })
                      .map(([key, value]) => `${key}: ${value} koin`)
                      .join(', '),
                    icon: 'UserPlus',
                    isLink: true,
                  })),
              },
              ...subMenuColumns,
            ],
          };
        }

        return navitem;
      }),
    );
  }, [plans]);

  return (
    <>
      {isMobile ? (
        <MobileNav
          navItems={navData}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          session={session}
        />
      ) : (
        <DesktopNav navItems={navData} session={session} />
      )}
    </>
  );
};

export default Navbar;
