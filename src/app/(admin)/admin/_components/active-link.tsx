'use client';

import { useAppContext } from '@/components/provider/provider-app';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface ActiveLinkProps {
  icon: any;
  href: any;
  label: any;
}

const ActiveLink = ({ icon, href, label }: ActiveLinkProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { minimizeSidebar } = useAppContext();

  if (!icon || !href || !label) {
    return null; // Jangan render apapun jika props tidak terdefinisi
  }

  const onClick = (e: any) => {
    if (e.currentTarget.tagName === 'FORM') {
      e.preventDefault();
    }

    router.push(href);
  };

  const isLabelActive = () => {
    if (pathname && label) {
      if (pathname === '/admin/category-tryout') {
        if (label === 'Category Tryout') {
          return true;
        }
        return false;
      }
      if (pathname === '/admin/category') {
        if (label === 'Category Document') return true;
        return false;
      }
      return pathname.toLowerCase().includes(label.toLowerCase());
    }
  };
  return (
    <Link
      href={href}
      passHref
    >
      <div
        onClick={onClick}
        className={`${
          isLabelActive()
            ? 'bg-main font-medium text-white'
            : 'font-medium text-main-gray-text md:hover:bg-main-gray-input'
        } mx-[.5rem] flex items-center gap-2 rounded-[.5rem] px-[1rem] py-[.8rem] duration-500`}
      >
        {icon}
        {!minimizeSidebar && (
          <span className="whitespace-nowrap text-sm">{label}</span>
        )}
      </div>
    </Link>
  );
};

export default ActiveLink;
