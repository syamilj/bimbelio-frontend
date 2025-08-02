import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IconArrowTwk } from '@/styles/icon';
import {
  BookOpen,
  Check,
  Eye,
  FileText,
  MessageSquare,
  PenTool,
  Sparkles,
} from 'lucide-react';

type CardProps = {
  data: PlanType;
  onSelect?: () => void;
  isSelected?: boolean;
  onClick?: () => any;
};

export const CardSubs = ({
  data,
  onSelect,
  isSelected,
  onClick,
}: CardProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  return (
    <Card
      key={data.name}
      className={cn(
        `flex w-full max-w-[340px] min-w-[300px] flex-col rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`,
        data.popular && 'shadow-xl ring-2 ring-[#0066ff]',
        isSelected && 'border-main border-2',
      )}
      onClick={onClick}
    >
      {data.popular && (
        <div className="absolute top-0 right-0 transform translate-x-0 -translate-y-0 z-10">
          <Badge className="bg-[#0066ff] text-white font-medium px-3 py-1 shadow-md">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Populer
          </Badge>
        </div>
      )}
      <div className="h-3 bg-gradient-default"></div>
      <CardHeader className="pb-0 pt-6">
        <CardTitle className="text-[#0a2540] text-2xl">{data.name}</CardTitle>
        <CardDescription className="text-[#64748b]">
          {data.description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-[#0a2540]">
            {formatPrice(data.price)}
          </span>
          <span className="text-[#64748b] ml-1">/{data.timeline}</span>
          {/* {billingCycle === "yearly" && (
          <div className="text-sm text-[#64748b] mt-1">
            Ditagih {formatPrice(data.price.yearly)} per tahun
          </div>
        )} */}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        {data.coins && (
          <div
            className="mb-6 p-5 rounded-xl relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${websiteSubCategory?.main_color}08, ${websiteSubCategory?.main_color}15)`,
              boxShadow: `0 4px 12px ${websiteSubCategory?.main_color}10`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 opacity-10"
              style={{
                background: `radial-gradient(circle, ${websiteSubCategory?.main_color} 0%, transparent 70%)`,
                transform: 'translate(30%, -30%)',
              }}
            ></div>
            <div className="mb-3">
              <span className="text-sm font-medium text-main-default">
                Bonus Coin
              </span>
            </div>{' '}
            <div className="grid grid-cols-5 gap-2">
              {data.coins.map((coin) => {
                const item = {
                  icon:
                    coin?.name === 'chat'
                      ? MessageSquare
                      : coin?.name === 'notes'
                        ? PenTool
                        : coin?.name === 'quiz'
                          ? BookOpen
                          : coin?.name === 'tryout'
                            ? FileText
                            : coin?.name === 'vision'
                              ? Eye
                              : PenTool,
                };
                return (
                  <div
                    className="flex flex-col items-center"
                    key={coin?.name}
                  >
                    <item.icon className="h-5 w-5 mb-1 text-main-default" />
                    <span className="text-xs text-[#4a5568] font-medium">
                      {coin?.name}
                    </span>
                    <span className="text-sm font-bold text-main-default">
                      {coin?.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3 px-1">
          {data.features?.map((feature, index) => (
            <div
              key={index}
              className="space-y-3 px-1"
            >
              <div
                key={feature.name}
                className="flex items-start"
              >
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 bg-gradient-default"
                  // style={{
                  //   boxShadow: `0 2px 4px ${websiteSubCategory?.main_color}30`,
                  // }}
                >
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-main-default text-sm font-semibold">
                  {feature.name}
                </span>
              </div>
              <div className="space-y-3">
                {feature.features.map((detail) => (
                  <div
                    key={detail}
                    className="flex items-start"
                  >
                    {/* <Undo className="h-3 w-3 text-white" /> */}
                    <IconArrowTwk
                      w={15}
                      className="text-main-default mr-2 ml-2"
                    />
                    <span className="text-main-default  text-sm">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
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

type PlanType = {
  id: string;
  tier: string;
  name: string;
  description: string;
  price: number;
  features:
    | {
        name: string;
        features: string[];
      }[]
    | undefined;
  timeline: string | null;
  coins:
    | ({
        name: string;
        total: number;
      } | null)[]
    | undefined;
  limitations: {
    Notes: string | null;
    Chat: string | null;
    Tryout: string | null;
    Quiz: string | null;
    Vision: string | null;
  };
  popular: boolean;
};
