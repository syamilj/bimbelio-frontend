'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import {
  Plan,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
} from '@/types/database';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DialogDelete } from './_components/dialog-delete-plan';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PlanList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState<
    (Plan & {
      PlanSubscription?: PlanSubscription & {
        PlanFeature: PlanFeature[];
      };
      PlanLimitation?: PlanLimitation;
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

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const coinPlans = filteredPlans.filter(
    (plan) =>
      (plan.PlanSubscription?.PlanFeature?.length ?? 0) === 0 &&
      !!plan.PlanLimitation,
  );

  const subscriptionPlans = filteredPlans.filter(
    (plan) =>
      (plan.PlanSubscription?.PlanFeature?.length ?? 0) > 0 &&
      !plan.PlanLimitation,
  );

  const bundlePlans = filteredPlans.filter(
    (plan) =>
      (plan.PlanSubscription?.PlanFeature?.length ?? 0) > 0 &&
      !!plan.PlanLimitation,
  );

  return (
    <div className="mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plan Management</h1>
        <Link href={`/${website_sub_category_id}/admin/plan/new`}>
          <Button className="bg-main hover:bg-main/80 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Plan
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search plans..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <PlanTable
            title="📦 Bundle Plans"
            plans={bundlePlans}
            getData={getData}
            type="bundle"
          />
          <PlanTable
            title="📃 Subscription Plans"
            plans={subscriptionPlans}
            getData={getData}
            type="subscription"
          />
          <PlanTable
            title="📀 Coin Plans"
            plans={coinPlans}
            getData={getData}
            type="coin"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function PlanTable({
  title,
  plans,
  getData,
  type,
}: {
  title: string;
  plans: (Plan & {
    PlanSubscription?: PlanSubscription & {
      PlanFeature: PlanFeature[];
    };
    PlanLimitation?: PlanLimitation;
  })[];
  getData: () => any;
  type: 'coin' | 'bundle' | 'subscription';
}) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              {type !== 'coin' && <TableHead>Subscription</TableHead>}
              {type !== 'subscription' && <TableHead>Coin</TableHead>}
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  No {title.toLowerCase()} found.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.slug}</TableCell>
                  {type !== 'coin' && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {plan.PlanSubscription?.PlanFeature.map((feat) => (
                          <Badge
                            key={feat.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {feat.type}
                          </Badge>
                        )) || '-'}
                      </div>
                    </TableCell>
                  )}
                  {type !== 'subscription' && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {plan.PlanLimitation
                          ? Object.keys({
                              chat: plan.PlanLimitation.chat,
                              notes: plan.PlanLimitation.notes,
                              vision: plan.PlanLimitation.vision,
                              quiz: plan.PlanLimitation.quiz,
                              tryout: plan.PlanLimitation.tryout,
                            })
                              .filter((item) => item !== null)
                              .map((limit, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {limit}: {(plan.PlanLimitation as any)[limit]}
                                </Badge>
                              ))
                          : '-'}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatCurrency(plan.price)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${website_sub_category_id}/admin/plan/${plan.id}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DialogDelete
                        getData={getData}
                        id={plan.id}
                        title="Delete Plan"
                        description="Are you sure you want to delete this plan? This action cannot be undone."
                      >
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogDelete>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// 'use client';

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
// import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
// import {
//   Plan,
//   PlanFeature,
//   PlanLimitation,
//   PlanSubscription,
// } from '@/types/database';
// import { Edit, Plus, Search, Trash2 } from 'lucide-react';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { DialogDelete } from './_components/dialog-delete-plan';

// // Format currency
// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// export default function PlanList() {
//   const [searchTerm, setSearchTerm] = useState('');
//   // const [categoryFilter, setCategoryFilter] = useState('');
//   const [plans, setPlans] = useState<
//     (Plan & {
//       PlanSubscription?: PlanSubscription & {
//         PlanFeature: PlanFeature[];
//       };
//       PlanLimitation?: PlanLimitation;
//     })[]
//   >([]);

//   const getData = async () => {
//     await getGeneral('/plan/getAllPlan', {
//       setData: setPlans,
//     });
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   // Filter plans based on search term and category
//   const filteredPlans = plans.filter((plan) => {
//     const matchesSearch =
//       plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       plan.slug.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });

//   return (
//     <div className="mx-auto p-6 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Plan Management</h1>
//         <Link href={`/${website_sub_category_id}/admin/plan/new`}>
//           <Button className="bg-main hover:bg-main/80 flex items-center gap-2">
//             <Plus className="h-4 w-4" />
//             Create New Plan
//           </Button>
//         </Link>
//       </div>

//       <Card className="mb-6">
//         <CardContent className="pt-6">
//           <div className="flex flex-col md:flex-row gap-4 justify-between">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder="Search plans..."
//                 className="pl-10"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Slug</TableHead>
//                   <TableHead>Subscription</TableHead>
//                   <TableHead>Limits</TableHead>
//                   <TableHead>Price</TableHead>
//                   <TableHead>Labels</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredPlans.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={7}
//                       className="text-center py-10 text-gray-500"
//                     >
//                       No plans found. Create a new plan to get started.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredPlans.map((plan) => (
//                     <TableRow key={plan.id}>
//                       <TableCell className="font-medium">{plan.name}</TableCell>
//                       <TableCell>{plan.slug}</TableCell>
//                       <TableCell>
//                         <div className="flex flex-wrap gap-1">
//                           {plan.PlanSubscription?.PlanFeature.map((feat) => (
//                             <Badge
//                               key={feat.id}
//                               variant="outline"
//                               className="text-xs"
//                             >
//                               {feat.type}
//                             </Badge>
//                           )) || '-'}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex flex-wrap gap-1">
//                           {plan.PlanLimitation
//                             ? Object.keys({
//                                 chat: plan.PlanLimitation.chat,
//                                 notes: plan.PlanLimitation.notes,
//                                 vision: plan.PlanLimitation.vision,
//                                 quiz: plan.PlanLimitation.quiz,
//                                 tryout: plan.PlanLimitation.tryout,
//                               })
//                                 .filter((item) => item !== null)
//                                 .map((limit, index) => {
//                                   return (
//                                     <Badge
//                                       key={index}
//                                       variant="outline"
//                                       className="text-xs"
//                                     >
//                                       {limit}:{' '}
//                                       {(plan.PlanLimitation as any)[limit]}
//                                     </Badge>
//                                   );
//                                 })
//                             : '-'}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex flex-col">
//                           <span className="font-medium">
//                             {formatCurrency(plan.price)}
//                           </span>
//                           {/* {plan.price.discount > 0 && (
//                             <span className="text-xs text-gray-500 line-through">
//                               {formatCurrency(plan.price.total)}
//                             </span>
//                           )} */}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         {/* <div className="flex flex-wrap gap-1">
//                           {plan.labels.highlight && (
//                             <Badge
//                               style={{
//                                 backgroundColor: plan.labels.highlight.bgColor,
//                                 color: plan.labels.highlight.textColor,
//                               }}
//                               className="text-xs"
//                             >
//                               {plan.labels.highlight.text}
//                             </Badge>
//                           )}
//                           {plan.labels.promo && (
//                             <Badge
//                               style={{
//                                 backgroundColor: plan.labels.promo.bgColor,
//                                 color: plan.labels.promo.textColor,
//                               }}
//                               className="text-xs"
//                             >
//                               {plan.labels.promo.text}
//                             </Badge>
//                           )}
//                         </div> */}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex items-center gap-2">
//                           <Link
//                             href={`/${website_sub_category_id}/admin/plan/${plan.id}`}
//                           >
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="flex items-center gap-1"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                           </Link>

//                           <DialogDelete
//                             getData={getData}
//                             id={plan.id}
//                             title="Delete Plan"
//                             description="Are you sure you want to delete this plan? This action cannot be undone."
//                           >
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               className="flex items-center gap-1"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </DialogDelete>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
