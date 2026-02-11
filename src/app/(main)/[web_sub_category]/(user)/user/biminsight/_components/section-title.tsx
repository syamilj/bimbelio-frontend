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
    <div className="py-6">
      <div className="flex md:hidden items-center gap-4 flex-1 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="flex-1 h-px rounded-full"
          style={{
            background: `${mainColor}40`,
          }}
        />
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="flex-1 h-px rounded-full"
          style={{
            background: `${mainColor}40`,
          }}
        />
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: mainColor }}
        />
      </div>
      <div className="relative z-10 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg"
          style={{
            backgroundColor: `${mainColor}15`,
            borderColor: `${mainColor}30`,
          }}
        >
          <Icon
            className="w-6 h-6"
            style={{ color: mainColor }}
          />
        </div>
        <div className="flex flex-col">
          <h2
            className="text-3xl font-black tracking-tight"
            style={{ color: mainColor }}
          >
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
        </div>
        <div className="hidden md:flex items-center gap-4 flex-1 ml-6">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: mainColor }}
          />
          <div
            className="flex-1 h-px rounded-full"
            style={{
              background: `${mainColor}40`,
            }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: mainColor }}
          />
          <div
            className="flex-1 h-px rounded-full"
            style={{
              background: `${mainColor}40`,
            }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: mainColor }}
          />
        </div>
      </div>
    </div>
  );
};
