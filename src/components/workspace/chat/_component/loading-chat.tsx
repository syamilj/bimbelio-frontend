//src/app/(user)/user/bimbot/_component/loading-chat.tsx
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getDate, getHours } from '@/lib/utils';
import { Bot } from 'lucide-react';

const LoadingChat = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <div
      className="flex w-full max-w-5xl mx-auto justify-start"
      style={{
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
        {/* Avatar */}
        <div className="shrink-0">
          <Avatar className="w-8 h-8 border border-gray-200">
            <AvatarFallback
              className="text-white font-semibold bg-linear-to-br"
              style={{
                backgroundImage: `linear-gradient(135deg, ${mainColor}, ${websiteSubCategory?.secondary_color || mainColor})`,
              }}
            >
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Message Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Bimbot AI</span>
              <div
                className="px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: mainColor }}
              >
                AI
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {getHours(new Date())} • {getDate(new Date())}
            </span>
          </div>

          {/* Loading Message Bubble */}
          <div
            className="relative rounded-2xl px-4 py-3 shadow-md border border-transparent"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            {/* Loading Content */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: mainColor,
                    animationDelay: '0ms',
                    animationDuration: '1.4s',
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: mainColor,
                    animationDelay: '160ms',
                    animationDuration: '1.4s',
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: mainColor,
                    animationDelay: '320ms',
                    animationDuration: '1.4s',
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                Bimbot sedang berpikir...
              </span>
            </div>

            {/* Message Tail */}
            <div
              className="absolute top-3 left-[-8px] w-0 h-0 border-r-8 border-t-4 border-t-transparent border-b-4 border-b-transparent"
              style={{
                borderRightColor: `${mainColor}08`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingChat;
