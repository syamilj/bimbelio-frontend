// Pengganti `next/navigation` untuk tes komponen: URL disimpan di memori dan
// `router.replace/push` memperbaruinya (komponen ikut render ulang).
//
//   vi.mock('next/navigation', () => import('<path>/test/utils/next-navigation'));
//   navigation.set('/utbk/admin/tryout?page=2');

import { useSyncExternalStore } from 'react';
import { vi } from 'vitest';

let current = new URL('http://localhost/');
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

const go = (href: string) => {
  current = new URL(href, current);
  window.history.replaceState(null, '', `${current.pathname}${current.search}`);
  notify();
};

export const navigation = {
  set: (href: string) => go(href),
  get url() {
    return current;
  },
  get search() {
    return current.searchParams;
  },
  params: {} as Record<string, string>,
};

const router = {
  replace: vi.fn((href: string) => go(href)),
  push: vi.fn((href: string) => go(href)),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useSearchParams() {
  const search = useSyncExternalStore(
    subscribe,
    () => current.search,
    () => current.search,
  );
  return new URLSearchParams(search);
}

export function usePathname() {
  return useSyncExternalStore(
    subscribe,
    () => current.pathname,
    () => current.pathname,
  );
}

export const useRouter = () => router;
export const useParams = () => navigation.params;
export const redirect = vi.fn();
export const notFound = vi.fn();
