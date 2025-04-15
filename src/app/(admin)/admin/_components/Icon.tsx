import { icons, LucideIcon as LucideIconType } from 'lucide-react';

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number | string;
}

const Icon = ({ name, color, size }: IconProps) => {
  const LucideIcon: LucideIconType = icons[name];

  if (!LucideIcon) {
    return null;
  }

  return (
    <LucideIcon
      color={color}
      size={size}
    />
  );
};

export default Icon;
