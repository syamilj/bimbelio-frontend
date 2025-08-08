import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { pixel } from '@/lib/pixel/_core'; // ✅ Import pixel untuk tracking
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
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
    <motion.div
      key={plan.name}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={cn(
        `rounded-3xl w-full max-w-[285px] overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-300`,
      )}
      style={{
        boxShadow: `0 4px 24px 0 ${websiteSubCategory?.main_color || '#0091FF'}15`,
      }}
    >
      {/* Top accent gradient matching main color */}
      <div
        className="h-3"
        style={{
          background: `linear-gradient(135deg, ${websiteSubCategory?.main_color || '#0091FF'}, ${websiteSubCategory?.secondary_color || '#5aa4dd'})`,
        }}
      ></div>

      <div className="p-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center">
          <div
            className="h-8 w-8 rounded-full mr-2 flex items-center justify-center shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${websiteSubCategory?.main_color || '#0091FF'}, ${websiteSubCategory?.secondary_color || '#5aa4dd'})`,
            }}
          >
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
        </h3>
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
      </div>
      <div>
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
      </div>
      <div className="px-6 pb-6">
        {!viewOnly && (
          <DialogPayment plan={plan}>
            <Button
              variant="outline"
              className="w-full rounded-xl h-12 font-medium shadow-md transition-all duration-300 hover:shadow-lg bg-gradient-default text-white hover:text-white hover:opacity-85"
              onClick={() => {
                // ✅ ADDTOCART TRACKING - Track saat user klik "Beli Sekarang" coin
                try {
                  pixel.meta.track('AddToCart', {
                    content_name: plan.name,
                    content_type: 'product',
                    value: plan.price,
                    currency: 'IDR',
                    contents: [{ id: plan.id, quantity: 1 }],
                  });

                  pixel.tiktok.track('AddToCart', {
                    content_name: plan.name,
                    content_type: 'product',
                    value: plan.price,
                    currency: 'IDR',
                    content_id: `coin_addtocart_${plan.id}`, // ✅ Required untuk TikTok VSA
                  });
                } catch (pixelError) {
                  console.warn(
                    'Pixel tracking error on coin add to cart:',
                    pixelError,
                  );
                }
              }}
            >
              Beli Sekarang
            </Button>
          </DialogPayment>
        )}
      </div>
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
