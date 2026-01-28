'use client';

import { RegistrationUserTryout } from '@/components/_shared/account/registration-user-tryout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RegistrationUserTryout>{children}</RegistrationUserTryout>;
}
