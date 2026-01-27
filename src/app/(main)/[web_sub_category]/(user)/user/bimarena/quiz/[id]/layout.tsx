import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import Provider from '../../try-out/provider';

export const metadata: Metadata = {
  ...METADATA_USER.tryOut,
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
