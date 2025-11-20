// src/app/(user)/layout.tsx (SERVER layout)
import LayoutGuest from '@/components/layout/layoutGuest';
import { ReactNode } from 'react';

//

export default function LayoutWebSubCategory({
  children,
}: {
  children: ReactNode;
}) {
  return <LayoutGuest>{children}</LayoutGuest>;
}
