import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, Eye, FileText, MessageSquare, PenTool } from 'lucide-react';
import { PlanDataType } from '../card-plan/_provider/types';
import { DialogPayment } from './_components/dialog-payment';

export const CardPlanTopping = ({
  plan,
  discount,
  viewOnly,
  onClose,
}: {
  plan: PlanDataType;
  viewOnly?: boolean;
  discount?: number;
  onClose?: () => void;
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  return (
    <Card
      key={plan.name}
      className={cn(
        `rounded-2xl w-full max-w-[285px] overflow-hidden border-0 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 `,
        // plan.popular ? 'shadow-xl ring-2 ring-[#0066ff]' : '',
      )}
    >
      {/* {plan.popular && (
        <div className="absolute top-0 right-0 transform translate-x-0 -translate-y-0 z-10">
          <Badge className="bg-[#0066ff] text-white font-medium px-3 py-1 shadow-md">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Best Value
          </Badge>
        </div>
      )} */}
      <div className="h-3 bg-gradient-default"></div>
      <CardHeader className="pt-6">
        <CardTitle className="text-xl text-[#0a2540] flex items-center">
          <div className="h-8 w-8 rounded-full mr-2 flex items-center justify-center shadow-sm bg-gradient-default">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="6"
                fill="white"
              />
            </svg>
          </div>
          {plan.name}
        </CardTitle>
        {plan.PlanLimitation && (
          <div
            className="mt-4 p-4 rounded-xl border border-main-default/10"
            style={{
              background: `linear-gradient(to right, ${websiteSubCategory?.main_color}08, ${websiteSubCategory?.main_color}15)`,
              boxShadow: `0 4px 12px ${websiteSubCategory?.main_color}10`,
            }}
          >
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(plan.PlanLimitation)
                .filter(
                  (key) =>
                    key !== 'id' && key !== 'expireDays' && key !== 'planId',
                )
                .map((key) => {
                  const total = (plan.PlanLimitation as any)[key];
                  const item = {
                    icon:
                      key === 'chat'
                        ? MessageSquare
                        : key === 'notes'
                          ? PenTool
                          : key === 'quiz'
                            ? BookOpen
                            : key === 'tryout'
                              ? FileText
                              : key === 'vision'
                                ? Eye
                                : PenTool,
                  };
                  return (
                    <div
                      className="flex flex-col items-center"
                      key={key}
                    >
                      <item.icon className="h-5 w-5 mb-1 text-main-default" />
                      <span className="text-xs text-[#4a5568] font-medium">
                        {key}
                      </span>
                      <span className="text-sm font-bold text-main-default">
                        {total}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-2xl font-bold text-[#0a2540] relative flex items-center w-fit',
            discount && 'opacity-60',
          )}
        >
          <span>{formatPrice(plan.price)}</span>
          <span className="text-[#64748b] ml-1 text-base font-normal">
            /{plan.timeline}
          </span>
          {discount && <span className="absolute w-full h-[2px] bg-gray-600" />}
        </div>
        {discount && (
          <div
            className={cn(
              'text-2xl font-bold text-[#0a2540] relative flex items-center',
            )}
          >
            <span>{formatPrice(discount)}</span>
            <span className="text-[#64748b] ml-1 text-base font-normal">
              /{plan.timeline}
            </span>
          </div>
        )}
        <p className="text-[#64748b] mt-1">Sekali bayar</p>
      </CardContent>
      <CardFooter className="pb-6">
        {!viewOnly && (
          <DialogPayment plan={plan}>
            <Button
              variant="outline"
              className="w-full rounded-xl h-12 font-medium shadow-md transition-all duration-300 hover:shadow-lg bg-gradient-default text-white hover:text-white hover:opacity-85"
              // onClick={onClick}
            >
              Beli Sekarang
            </Button>
          </DialogPayment>
        )}
      </CardFooter>
    </Card>
  );
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};
