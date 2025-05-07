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
import { getGeneral } from '@/lib/fetch-helper';
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
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';

// Mock data for plans
// const mockPlans = [
//   {
//     id: 1,
//     name: "Basic Plan",
//     slug: "basic-plan",
//     category: "Individual",
//     subcategory: "Starter",
//     duration: {
//       value: 30,
//       unit: "days",
//     },
//     limits: [
//       { type: "chat", limit: 100 },
//       { type: "notes", limit: 50 },
//     ],
//     features: ["Konsultasi", "Analisis AI"],
//     price: {
//       total: 99000,
//       discount: 10,
//       grandTotal: 89100,
//     },
//     labels: {
//       highlight: {
//         text: "Popular",
//         bgColor: "#FFD700",
//         textColor: "#000000",
//       },
//       promo: {
//         text: "10% OFF",
//         bgColor: "#FF4500",
//         textColor: "#FFFFFF",
//       },
//     },
//     createdAt: "2023-04-15",
//   },
//   {
//     id: 2,
//     name: "Premium Plan",
//     slug: "premium-plan",
//     category: "Business",
//     subcategory: "Professional",
//     duration: {
//       value: 90,
//       unit: "days",
//     },
//     limits: [
//       { type: "chat", limit: 500 },
//       { type: "notes", limit: 250 },
//       { type: "vision", limit: 100 },
//     ],
//     features: ["Konsultasi", "Analisis AI", "Materi Premium"],
//     price: {
//       total: 299000,
//       discount: 15,
//       grandTotal: 254150,
//     },
//     labels: {
//       highlight: {
//         text: "Best Value",
//         bgColor: "#4CAF50",
//         textColor: "#FFFFFF",
//       },
//       promo: null,
//     },
//     createdAt: "2023-05-20",
//   },
//   {
//     id: 3,
//     name: "Enterprise Plan",
//     slug: "enterprise-plan",
//     category: "Business",
//     subcategory: "Enterprise",
//     duration: {
//       value: 1,
//       unit: "year",
//     },
//     limits: [
//       { type: "chat", limit: 5000 },
//       { type: "notes", limit: 1000 },
//       { type: "vision", limit: 500 },
//       { type: "quiz", limit: 100 },
//       { type: "try out", limit: 50 },
//     ],
//     features: ["Konsultasi", "Analisis AI", "Materi Premium"],
//     price: {
//       total: 999000,
//       discount: 20,
//       grandTotal: 799200,
//     },
//     labels: {
//       highlight: {
//         text: "Enterprise",
//         bgColor: "#1E3A8A",
//         textColor: "#FFFFFF",
//       },
//       promo: {
//         text: "20% OFF",
//         bgColor: "#FF4500",
//         textColor: "#FFFFFF",
//       },
//     },
//     createdAt: "2023-06-10",
//   },
// ];

// Format currency
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
  // const [categoryFilter, setCategoryFilter] = useState('');
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

  // Filter plans based on search term and category
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Limits</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Labels</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-gray-500"
                    >
                      No plans found. Create a new plan to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.slug}</TableCell>
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
                                .map((limit, index) => {
                                  return (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {limit}:{' '}
                                      {(plan.PlanLimitation as any)[limit]}
                                    </Badge>
                                  );
                                })
                            : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatCurrency(plan.price)}
                          </span>
                          {/* {plan.price.discount > 0 && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatCurrency(plan.price.total)}
                            </span>
                          )} */}
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* <div className="flex flex-wrap gap-1">
                          {plan.labels.highlight && (
                            <Badge
                              style={{
                                backgroundColor: plan.labels.highlight.bgColor,
                                color: plan.labels.highlight.textColor,
                              }}
                              className="text-xs"
                            >
                              {plan.labels.highlight.text}
                            </Badge>
                          )}
                          {plan.labels.promo && (
                            <Badge
                              style={{
                                backgroundColor: plan.labels.promo.bgColor,
                                color: plan.labels.promo.textColor,
                              }}
                              className="text-xs"
                            >
                              {plan.labels.promo.text}
                            </Badge>
                          )}
                        </div> */}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Link href={`/${website_sub_category_id}/admin/plan/${plan.id}`}>
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
        </CardContent>
      </Card>
    </div>
  );
}
