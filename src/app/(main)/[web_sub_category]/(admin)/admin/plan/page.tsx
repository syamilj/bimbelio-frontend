'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import {
  Plan,
  PlanBenefit,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
} from '@/types/database';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PlanDataTable } from './_components/plan-data-table';

export default function PlanList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState<
    (Plan & {
      PlanSubscription?: PlanSubscription & {
        PlanFeature: PlanFeature[];
      };
      PlanLimitation?: PlanLimitation;
      PlanBenefit: PlanBenefit[];
      _count?: {
        Subscription: number;
      };
    })[]
  >([]);

  const getData = async () => {
    await getGeneral('/plan/getAllPlan', {
      setData: setPlans,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch =
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.slug.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [plans, searchTerm]);

  return (
    <div className="mx-auto p-6 min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plan Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription bundles, coins, and benefits here.
          </p>
        </div>
        <Link href={`/${website_sub_category_id}/admin/plan/new`}>
          <Button className="bg-main hover:bg-main/80 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Plan
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search plans by name or slug..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="active"
        className="w-full"
      >
        <TabsList className="mb-4 flex flex-wrap h-auto gap-2 bg-transparent justify-start p-0">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white border bg-white"
          >
            Active Plans
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="data-[state=active]:bg-gray-600 data-[state=active]:text-white border bg-white"
          >
            Drafts & Inactive
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="active"
          className="mt-0"
        >
          <PlanTabs
            plans={filteredPlans.filter((p) => p.status === 'PUBLIC')}
            getData={getData}
          />
        </TabsContent>

        <TabsContent
          value="inactive"
          className="mt-0"
        >
          <PlanTabs
            plans={filteredPlans.filter((p) => p.status !== 'PUBLIC')}
            getData={getData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const PlanTabs = ({
  plans,
  getData,
}: {
  plans: any[];
  getData: () => Promise<void>;
}) => {
  const { bundlePlans, subscriptionPlans, coinPlans, benefitOnly, other } =
    useMemo(() => {
      return {
        bundlePlans: plans.filter(
          (plan) =>
            (plan.PlanSubscription?.PlanFeature?.length ?? 0) > 0 &&
            !!plan.PlanLimitation,
        ),
        subscriptionPlans: plans.filter(
          (plan) =>
            (plan.PlanSubscription?.PlanFeature?.length ?? 0) > 0 &&
            !plan.PlanLimitation,
        ),
        coinPlans: plans.filter(
          (plan) =>
            (plan.PlanSubscription?.PlanFeature?.length ?? 0) === 0 &&
            !!plan.PlanLimitation,
        ),
        benefitOnly: plans.filter(
          (plan) =>
            !plan.PlanLimitation &&
            (plan.PlanSubscription?.PlanFeature?.length ?? 0) === 0 &&
            plan.PlanBenefit.length > 0,
        ),
        other: plans.filter(
          (plan) =>
            !plan.PlanLimitation &&
            (plan.PlanSubscription?.PlanFeature?.length ?? 0) === 0 &&
            plan.PlanBenefit.length === 0,
        ),
      };
    }, [plans]);

  return (
    <Tabs
      defaultValue="all"
      className="w-full"
    >
      <TabsList className="mb-4 flex flex-wrap h-auto gap-2 bg-transparent justify-start p-0">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 border bg-white text-xs h-7"
        >
          All ({plans.length})
        </TabsTrigger>
        <TabsTrigger
          value="bundle"
          className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 border bg-white text-xs h-7"
        >
          Bundles ({bundlePlans.length})
        </TabsTrigger>
        <TabsTrigger
          value="subscription"
          className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 border bg-white text-xs h-7"
        >
          Subscriptions ({subscriptionPlans.length})
        </TabsTrigger>
        <TabsTrigger
          value="coin"
          className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 border bg-white text-xs h-7"
        >
          Coins ({coinPlans.length})
        </TabsTrigger>
        <TabsTrigger
          value="benefit"
          className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 border bg-white text-xs h-7"
        >
          Benefit Only ({benefitOnly.length})
        </TabsTrigger>
        <TabsTrigger
          value="other"
          className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 border bg-white text-xs h-7"
        >
          Other ({other.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="all"
        className="mt-0"
      >
        <Card>
          <CardContent className="pt-6">
            <PlanDataTable
              plans={plans}
              getData={getData}
              type="other"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="bundle"
        className="mt-0"
      >
        <Card>
          <CardContent className="pt-6">
            <PlanDataTable
              plans={bundlePlans}
              getData={getData}
              type="bundle"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="subscription"
        className="mt-0"
      >
        <Card>
          <CardContent className="pt-6">
            <PlanDataTable
              plans={subscriptionPlans}
              getData={getData}
              type="subscription"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="coin"
        className="mt-0"
      >
        <Card>
          <CardContent className="pt-6">
            <PlanDataTable
              plans={coinPlans}
              getData={getData}
              type="coin"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="benefit"
        className="mt-0"
      >
        <Card>
          <CardContent className="pt-6">
            <PlanDataTable
              plans={benefitOnly}
              getData={getData}
              type="benefit"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent
        value="other"
        className="mt-0"
      >
        <Card>
          <CardContent className="pt-6">
            <PlanDataTable
              plans={other}
              getData={getData}
              type="other"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
