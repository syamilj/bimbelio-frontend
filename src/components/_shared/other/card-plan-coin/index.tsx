import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Coins,
  Eye,
  FileText,
  MessageSquare,
  PenTool,
} from 'lucide-react';
import { PlanDataType } from '../card-plan/_provider/types';
import { DialogPayment } from './_components/dialog-payment';

export const CardPlanTopping = ({
  plan,
  discount,
  viewOnly,
  onClose,
  classOverlay,
}: {
  plan: PlanDataType;
  viewOnly?: boolean;
  discount?: number;
  onClose?: () => void;
  classOverlay?: string;
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <motion.div
      key={plan.name}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <Card
        className="border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl bg-white"
        style={{ borderColor: `${mainColor}20` }}
      >
        {/* Top Accent Bar */}
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
          }}
        />

        <CardContent className="p-6 space-y-6">
          {/* Header with Icon */}
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-2xl shadow-md"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
              <p className="text-xs text-gray-600 font-medium">
                Paket Coin Tambahan
              </p>
            </div>
          </div>

          {/* Features Grid */}
          {plan.PlanLimitation && (
            <div
              className="p-4 rounded-xl border-2"
              style={{
                backgroundColor: `${mainColor}08`,
                borderColor: `${mainColor}15`,
              }}
            >
              <div className="grid grid-cols-5 gap-3">
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
                    const IconComponent = item.icon;
                    return (
                      <div
                        className="flex flex-col items-center text-center"
                        key={key}
                      >
                        <div
                          className="p-2 rounded-lg mb-1"
                          style={{
                            backgroundColor: `${mainColor}15`,
                          }}
                        >
                          <IconComponent
                            className="w-4 h-4"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 font-bold capitalize">
                          {key}
                        </span>
                        <Badge
                          className="mt-1 text-xs font-black"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                            color: 'white',
                          }}
                        >
                          {total}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div
                className={cn(
                  'text-3xl font-black',
                  discount && 'line-through opacity-50 text-gray-500 text-xl',
                )}
                style={!discount ? { color: mainColor } : undefined}
              >
                {formatPrice(plan.price)}
              </div>
              {!discount && (
                <span className="text-gray-600 text-sm font-medium">
                  /{plan.timeline}
                </span>
              )}
            </div>
            {discount && (
              <div className="flex items-baseline gap-2">
                <div
                  className="text-3xl font-black"
                  style={{ color: mainColor }}
                >
                  {formatPrice(discount)}
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  /{plan.timeline}
                </span>
              </div>
            )}
            <p className="text-sm text-gray-600 font-medium">Sekali bayar</p>
          </div>

          {/* Action Button */}
          {!viewOnly && (
            <DialogPayment
              plan={plan}
              classOverlay={classOverlay}
            >
              <Button
                className="w-full h-12 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Coins className="w-5 h-5 mr-2" />
                Beli Sekarang
              </Button>
            </DialogPayment>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
};
