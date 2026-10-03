import ProviderUtm from '@/app/(link)/link/[slug]/_components/provider-utm-link-page';

export default function LinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-ink">
      <ProviderUtm>{children}</ProviderUtm>
    </div>
  );
}
