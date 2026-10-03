'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Satu parameter query sebagai state (mis. tab aktif). Nilai default tidak
 * ditulis ke URL. Harus berada di dalam `<Suspense>`.
 */
export function useUrlParam<T extends string>(
  name: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const value = (params.get(name) as T | null) ?? defaultValue;

  const setValue = useCallback(
    (next: T) => {
      const qs = new URLSearchParams(window.location.search);
      if (next === defaultValue) qs.delete(name);
      else qs.set(name, next);
      const s = qs.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [name, defaultValue, pathname, router],
  );

  return [value, setValue];
}
