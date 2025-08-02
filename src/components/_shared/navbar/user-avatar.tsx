import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/database';

import { AvatarProps } from '@radix-ui/react-avatar';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>;
}

function UserAvatar({ user, ...props }: UserAvatarProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <Avatar
      {...props}
      className="ring-2 ring-offset-2 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl hover:ring-4"
      style={
        {
          '--tw-ring-color': `${mainColor}50`,
          '--tw-ring-offset-color': 'white',
        } as React.CSSProperties
      }
    >
      {user.image ? (
        <AvatarImage
          alt="Picture"
          src={user.image}
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <AvatarFallback
          className="text-white font-bold shadow-inner transition-all duration-300 hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          {user.name ? (
            <span className="text-lg font-bold drop-shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserIcon className="h-4 w-4 drop-shadow-sm" />
          )}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
