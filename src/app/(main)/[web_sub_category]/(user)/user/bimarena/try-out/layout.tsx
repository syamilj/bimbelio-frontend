import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...METADATA_USER.tryOut,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
