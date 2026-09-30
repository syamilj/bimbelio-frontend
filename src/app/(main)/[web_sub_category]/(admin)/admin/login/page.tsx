'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setAuthToken } from '@/lib/auth-helper';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { Loader2 } from 'lucide-react';
import { FormEvent } from 'react';

export default function Page() {
  const { mutate, isLoading } = useMutation<{ token: string }>(
    '/auth/loginUserAccount',
    'post',
    {
      onSuccess({ data }) {
        if (data?.token) {
          setAuthToken(data.token);
          window.location.pathname = '/';
        }
      },
    },
  );
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    await mutate({ payload: { email } });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        placeholder="Email"
      />
      <Button
        className="mt-4"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Submit'}
      </Button>
    </form>
  );
}
