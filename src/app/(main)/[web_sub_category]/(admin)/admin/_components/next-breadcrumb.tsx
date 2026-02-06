'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const NextBreadcrumb = () => {
  const paths = usePathname();

  const pathNames = paths?.split('/').filter((path) => path);

  // Limit breadcrumb items on mobile
  const displayPaths = pathNames?.slice(-3) || []; // Show max 3 items on mobile

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList className="flex-wrap">
        {displayPaths?.map((path, index) => {
          const fullIndex = pathNames!.length - displayPaths.length + index;
          let href = `/${pathNames!.slice(0, fullIndex + 1).join('/')}`;
          if (path === 'dashboard') {
            href = '/user/bimboard';
          }

          // Truncate long path names
          const displayPath =
            path.length > 20 ? path.slice(0, 20) + '...' : path;

          return (
            <div
              key={path}
              className="flex items-center gap-2"
            >
              <BreadcrumbItem>
                {index === displayPaths.length - 1 ? (
                  <BreadcrumbPage className="capitalize max-w-[150px] md:max-w-none truncate">
                    {displayPath.replace(/-/g, ' ')}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className="capitalize max-w-[100px] md:max-w-none truncate"
                    >
                      {displayPath.replace(/-/g, ' ')}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {displayPaths.length !== index + 1 && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NextBreadcrumb;
