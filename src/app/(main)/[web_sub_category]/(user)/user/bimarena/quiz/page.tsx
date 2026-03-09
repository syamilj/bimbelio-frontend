'use client';

import { RegistrationUserTryout } from '@/components/_shared/account/registration-user-tryout';
import BimArenaQuizPage from './(overview)/page';

export default function BimArenaQuizRootPage() {
  return (
    <RegistrationUserTryout>
      <BimArenaQuizPage />
    </RegistrationUserTryout>
  );
}
