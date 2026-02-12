import ButtonPayment from '@/app/(main)/[web_sub_category]/(user)/user/_components/button-payment';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { IconCrown } from '@/styles/icon';
import {
  BookOpen,
  FileText,
  MessageSquare,
  Pencil,
  Eye,
  Swords,
  Medal,
} from 'lucide-react';

export const SubscriptionTab = ({ data, handlePay, mainColor }: any) => (
  <div className="p-5 space-y-4 pb-20">
    <Plans mainColor={mainColor} />
    <ButtonPayment text="Upgrade Subscription" />
  </div>
);

const featureConfig = [
  { key: 'course', label: 'Bahan Ajar', icon: BookOpen, color: '#3b82f6', type: 'access', featureKey: 'course' },
  { key: 'document', label: 'Document', icon: FileText, color: '#10b981', type: 'access', featureKey: 'document' },
  { key: 'chat', label: 'Chat AI', icon: MessageSquare, color: '#8b5cf6', type: 'coin', limitKey: 'chat', limitMaxKey: 'chatLimit' },
  { key: 'notes', label: 'Notes', icon: Pencil, color: '#f59e0b', type: 'coin', limitKey: 'notes', limitMaxKey: 'notesLimit' },
  { key: 'quiz', label: 'Quiz', icon: Swords, color: '#ef4444', type: 'coin', limitKey: 'quiz', limitMaxKey: 'quizLimit' },
  { key: 'tryout', label: 'Tryout', icon: Medal, color: '#0ea5e9', type: 'coin', limitKey: 'tryout', limitMaxKey: 'tryoutLimit' },
  { key: 'vision', label: 'Vision', icon: Eye, color: '#14b8a6', type: 'coin', limitKey: 'vision', limitMaxKey: 'visionLimit' },
];

const Plans = ({ mainColor }: { mainColor: string }) => {
  const { userLimitation } = useUserLimitation();
  const { data: session } = useSession();
  const features = session?.user.feature;
  const role = session?.user.role;
  const tier = session?.user.tier;

  return (
    <div className="space-y-4">
      {/* Tier */}
      <div className="flex items-center gap-3 p-3 rounded-3xl bg-slate-50 border border-slate-100">
        <div
          className="w-9 h-9 rounded-3xl flex items-center justify-center text-white"
          style={{ backgroundColor: mainColor }}
        >
          <IconCrown className="w-4 h-4" />
        </div>
        <div>
          <p className="font-black text-slate-800">{tier || 'Gratis'}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Plan</p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {featureConfig.map((feat) => {
          const Icon = feat.icon;
          let value: string;

          if (feat.type === 'access') {
            const hasAccess = feat.featureKey === 'course' ? features?.course : features?.document;
            value = hasAccess ? 'Semua' : 'Terbatas';
          } else {
            const used = role === 'ADMIN' ? '-' : (userLimitation as any)?.[feat.limitKey!];
            const limit = (userLimitation as any)?.[feat.limitMaxKey!];
            value = `${used}/${limit || '∞'}`;
          }

          return (
            <div
              key={feat.key}
              className="p-3 rounded-3xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-3xl flex items-center justify-center mb-2"
                style={{ backgroundColor: `${feat.color}15` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: feat.color }} />
              </div>
              <p className="text-sm font-black text-slate-800">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: feat.color }}>
                {feat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
