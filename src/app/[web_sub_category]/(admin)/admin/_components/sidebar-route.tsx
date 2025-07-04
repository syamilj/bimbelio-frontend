'use client';
import { useAppContext } from '@/components/provider/provider-app';
import ChooseWebCategory from '@/components/ui/choose-web-category';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import {
  IconBlogAdmin,
  IconCourse,
  IconDocumentAdmin,
  IconReceipt,
  IconTryOut,
  IconUserAdmin,
} from '@/styles/icon';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import ActiveLink from './active-link';

const SidebarRoute: FC = () => {
  const pathname = usePathname();
  const { minimizeSidebar } = useAppContext();

  const routes = [
    {
      icon: (
        <IconReceipt
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('website-category')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
        />
      ),
      href: `/${website_sub_category_id}/admin/website-category`,
      label: 'Web Category',
    },
    {
      icon: (
        <IconUserAdmin
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('user')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
          active={pathname?.toLowerCase().includes('user') ? true : false}
        />
      ),
      href: `/${website_sub_category_id}/admin/user`,
      label: 'User',
    },
    {
      icon: (
        <IconUserAdmin
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('pricing')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
          active={pathname?.toLowerCase().includes('pricing') ? true : false}
        />
      ),
      href: `/${website_sub_category_id}/admin/pricing`,
      label: 'Pricing',
    },

    {
      icon: (
        <IconReceipt
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('plan')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
        />
      ),
      href: `/${website_sub_category_id}/admin/plan`,
      label: 'Plan',
    },
    {
      icon: (
        <IconTryOut
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('/transaction')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
          active={
            pathname?.toLowerCase().includes('/transaction') ? true : false
          }
        />
      ),
      href: `/${website_sub_category_id}/admin/transaction`,
      label: 'Transaction',
    },
    {
      icon: (
        <IconBlogAdmin
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('blog')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
          active={pathname?.toLowerCase().includes('blog') ? true : false}
        />
      ),
      href: `/${website_sub_category_id}/admin/blog`,
      label: 'Blog',
    },
    {
      icon: (
        <IconDocumentAdmin
          w={20}
          className={`text-[1.5rem] ${
            pathname?.toLowerCase() !== '/admin/category'
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
        />
      ),
      href: `/${website_sub_category_id}/admin/category`,
      label: 'Category Document',
    },
    {
      icon: (
        <IconDocumentAdmin
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('document')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
          active={pathname?.toLowerCase().includes('document') ? true : false}
        />
      ),
      href: `/${website_sub_category_id}/admin/document`,
      label: 'Document',
    },
    {
      icon: (
        <IconTryOut
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('category-tryout')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
        />
      ),
      href: `/${website_sub_category_id}/admin/category-tryout`,
      label: 'Category Tryout',
    },
    {
      icon: (
        <IconTryOut
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('/tryout')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
          active={pathname?.toLowerCase().includes('/tryout') ? true : false}
        />
      ),
      href: `/${website_sub_category_id}/admin/tryout`,
      label: 'Tryout',
    },
    {
      icon: (
        <IconCourse
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('course')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
          active={pathname?.toLowerCase().includes('course') ? true : false}
        />
      ),
      href: `/${website_sub_category_id}/admin/course`,
      label: 'Course',
    },
    {
      icon: (
        <IconReceipt
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes('token')
              ? 'text-main-gray-text2'
              : 'text-white'
          }`}
        />
      ),
      href: `/${website_sub_category_id}/admin/token`,
      label: 'Token',
    },
  ];
  return (
    <div className="flex flex-col gap-[.5rem]">
      <div className={cn('px-2 w-full', minimizeSidebar && 'hidden')}>
        <ChooseWebCategory minimizeSidebar={false} />
      </div>
      {routes.map((route, index) => (
        <ActiveLink
          key={index}
          icon={route.icon}
          href={route.href}
          label={route.label}
        />
      ))}
    </div>
  );
};

export default SidebarRoute;
