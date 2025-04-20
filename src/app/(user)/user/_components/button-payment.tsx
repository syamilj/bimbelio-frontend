import { useAppContext } from "@/components/provider/provider-app";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { cn } from "@/lib/utils";
import { IconCrown } from "@/styles/icon";

export default function ButtonPayment({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { setTransactionPopUp } = useAppContext();

  // return null;
  return (
    <button
      className={cn(
        "flex h-fit w-fit items-center gap-[.5rem] rounded-[.8rem] px-[1rem] py-[.7rem] text-[.9rem] text-white duration-300 md:hover:opacity-90",
        className
      )}
      style={{
        background: `linear-gradient(145deg, ${websiteSubCategory?.secondary_color}, ${websiteSubCategory?.main_color})`,
      }}
      onClick={() => setTransactionPopUp(true)}
    >
      <IconCrown w={15} />
      <p className="font-regular">{text ? text : "Upgrade"}</p>
    </button>
  );
}
