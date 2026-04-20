import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { LucideIconType } from '@/types/utils';

export const SectionTitle = ({
  icon,
  title,
  description,
}: {
  title: string;
  description?: string;
  icon: LucideIconType;
}) => {
  const { mainColor } = useWebsiteSubCategory();
  const Icon = icon;

  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-10 h-10 rounded-3xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: mainColor }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-800">{title}</h2>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
    </div>
  );
};
