'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  Plan,
  PlanBenefit,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
} from '@/types/database';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, Edit, Info, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DialogDelete } from './dialog-delete-plan';

interface PlanWithRelations extends Plan {
  PlanSubscription?: PlanSubscription & {
    PlanFeature: PlanFeature[];
  };
  PlanLimitation?: PlanLimitation;
  PlanBenefit: PlanBenefit[];
  _count?: {
    Subscription: number;
  };
}

interface PlanDataTableProps {
  plans: PlanWithRelations[];
  getData: () => Promise<void>;
  type: 'bundle' | 'subscription' | 'coin' | 'benefit' | 'other';
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLIC':
      return 'text-green-700 bg-green-100 border-green-200';
    case 'DRAFT':
      return 'text-gray-700 bg-gray-100 border-gray-200';
    case 'COMING_SOON':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    case 'INACTIVE':
      return 'text-red-700 bg-red-100 border-red-200';
    default:
      return 'text-gray-700 bg-gray-100 border-gray-200';
  }
};

export function PlanDataTable({ plans, getData, type }: PlanDataTableProps) {
  const router = useRouter();
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-gray-50/50 dashed border-gray-200">
        <p className="text-muted-foreground">No plans found in this category.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Features</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{plan.name}</span>
                    {plan.recommended && (
                      <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <code className="text-xs text-muted-foreground bg-gray-100 px-1 py-0.5 rounded w-fit">
                    {plan.slug}
                  </code>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <div className="font-medium text-emerald-600">
                    {formatCurrency(plan.price)}
                  </div>
                  {plan.originalPrice && plan.originalPrice > plan.price && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-400 line-through">
                        {formatCurrency(plan.originalPrice)}
                      </span>
                      <span className="text-red-500 font-medium">
                        {Math.round(
                          ((plan.originalPrice - plan.price) /
                            plan.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={plan.status}
                  onValueChange={async (value) => {
                    await mutateGeneral('/plan/editPlan', {
                      type: 'put',
                      payload: { id: plan.id, status: value },
                      onSuccess: () => getData(),
                    });
                  }}
                >
                  <SelectTrigger
                    className={`h-8 w-[130px] ${getStatusColor(plan.status)}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  {/* Subscriber Count */}
                  {plan._count?.Subscription !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-900">{plan._count.Subscription}</span> Users
                    </div>
                  )}

                  {/* Max Users */}
                  {plan.maxUsers && (
                    <div className="text-xs text-gray-500">
                      Limit: <span className="font-medium">{plan.maxUsers}</span> users
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2 max-w-[250px]">
                   {/* Tier */}
                   {plan.PlanSubscription?.tier && (
                    <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                      Tier {plan.PlanSubscription.tier}
                    </Badge>
                  )}

                  {/* Features Count */}
                  {plan.PlanSubscription?.PlanFeature &&
                    plan.PlanSubscription.PlanFeature.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="cursor-help gap-1 hover:bg-gray-100">
                              <Info className="w-3 h-3" />
                              {plan.PlanSubscription.PlanFeature.length} Features
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px]">
                            <ul className="list-disc pl-4 text-xs space-y-1">
                              {plan.PlanSubscription.PlanFeature.map((feat) => (
                                <li key={feat.id}>{feat.type}</li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                  {/* Benefits Count */}
                  {plan.PlanBenefit && plan.PlanBenefit.length > 0 && (
                     <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 cursor-help gap-1 hover:bg-blue-100">
                            {plan.PlanBenefit.length} Benefits
                         </Badge>
                       </TooltipTrigger>
                       <TooltipContent className="max-w-[300px]">
                         <ul className="list-disc pl-4 text-xs space-y-1">
                           {plan.PlanBenefit.map((benefit) => (
                             <li key={benefit.id}>{benefit.title}</li>
                           ))}
                         </ul>
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                  )}

                  {/* Limitations Count */}
                  {plan.PlanLimitation && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="cursor-help gap-1 hover:bg-gray-200">
                            Limits
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            {Object.entries({
                              Chat: plan.PlanLimitation.chat,
                              Notes: plan.PlanLimitation.notes,
                              Vision: plan.PlanLimitation.vision,
                              Quiz: plan.PlanLimitation.quiz,
                              Tryout: plan.PlanLimitation.tryout,
                            })
                              .filter(
                                ([_, value]) => value !== null && value !== undefined
                              )
                              .map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {value}
                                </div>
                              ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {type !== 'coin' && (
                    <Link
                      href={`/${website_sub_category_id}/admin/plan/user/${plan.id}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View Users"
                        className="h-8 w-8 text-gray-500 hover:text-gray-900"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Duplicate Plan"
                    onClick={async () => {
                  try {
                    await mutateGeneral(`/plan/editPlan/duplicate/${plan.id}`, {
                      type: 'post',
                      payload: {},
                      onSuccess: (data: any) => {
                        const newPlan = data.data; // adjust based on response structure
                        if (newPlan && newPlan.id) {
                          router.push(
                            `/${website_sub_category_id}/admin/plan/${newPlan.id}`
                          );
                        } else {
                          getData();
                        }
                      },
                    });
                  } catch (e) {
                    console.error('Failed to duplicate:', e);
                  }
                }}
                    className="h-8 w-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Link href={`/${website_sub_category_id}/admin/plan/${plan.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit Plan"
                      className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
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
                      variant="ghost"
                      size="icon"
                      title="Delete Plan"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogDelete>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
