'use client';

import { RegistrationUserTryout } from '@/components/_shared/account/registration-user-tryout';
import LiveLearningDashboard from './main-page';

export default function LiveLearningPage() {
  return (
    <RegistrationUserTryout>
      <LiveLearningDashboard />
    </RegistrationUserTryout>
  );
}
