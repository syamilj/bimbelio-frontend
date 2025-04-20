import { cn } from "@/lib/utils";
import { MouseEventHandler, ReactNode } from "react";
import { useWebsiteSubCategory } from "../provider/provider-website-category";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

export default function AnimatedGradientText({
  children,
  className,
  onClick,
}: AnimatedGradientTextProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  return (
    <span
      className={cn(
        "relative inline-block animate-gradient cursor-pointer bg-clip-text text-transparent",
        className
      )}
      onClick={onClick}
      style={{
        backgroundImage: `linear-gradient(to right, ${websiteSubCategory?.secondary_color}, ${websiteSubCategory?.main_color}, ${websiteSubCategory?.main_color})`,
        backgroundSize: "200% 200%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}
